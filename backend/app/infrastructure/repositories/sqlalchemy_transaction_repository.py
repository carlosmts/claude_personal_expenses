from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.entities.transaction import Transaction
from app.domain.repositories.transaction_repository import TransactionRepository
from app.infrastructure.models.transaction_model import TransactionModel


def _to_domain(model: TransactionModel) -> Transaction:
    return Transaction(
        id=model.id,
        date=model.date,
        type=model.type,
        amount=model.amount,
        category_id=model.category_id,
        user_id=model.user_id,
        description=model.description,
    )


class SqlAlchemyTransactionRepository(TransactionRepository):
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def add(self, transaction: Transaction) -> Transaction:
        model = TransactionModel(
            date=transaction.date,
            type=transaction.type,
            amount=transaction.amount,
            category_id=transaction.category_id,
            user_id=transaction.user_id,
            description=transaction.description,
        )
        self._session.add(model)
        await self._session.flush()
        await self._session.refresh(model)
        return _to_domain(model)

    async def list_all(self) -> list[Transaction]:
        result = await self._session.execute(
            select(TransactionModel).order_by(
                TransactionModel.date.desc(), TransactionModel.id.desc()
            )
        )
        return [_to_domain(model) for model in result.scalars()]

    async def get_by_id(self, transaction_id: int) -> Transaction | None:
        model = await self._session.get(TransactionModel, transaction_id)
        return _to_domain(model) if model else None

    async def update(self, transaction: Transaction) -> Transaction:
        model = await self._session.get(TransactionModel, transaction.id)
        assert model is not None, "update() requires an existing transaction id"

        model.date = transaction.date
        model.type = transaction.type
        model.amount = transaction.amount
        model.category_id = transaction.category_id
        model.user_id = transaction.user_id
        model.description = transaction.description

        await self._session.flush()
        await self._session.refresh(model)
        return _to_domain(model)

    async def delete(self, transaction_id: int) -> bool:
        model = await self._session.get(TransactionModel, transaction_id)
        if model is None:
            return False

        await self._session.delete(model)
        await self._session.flush()
        return True
