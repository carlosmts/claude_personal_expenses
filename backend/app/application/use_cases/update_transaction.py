from app.application.dto import CreateTransactionInput, TransactionDetail
from app.application.exceptions import TransactionNotFoundError, UserNotFoundError
from app.application.use_cases.create_category import CreateCategoryUseCase
from app.domain.entities.transaction import Transaction
from app.domain.repositories.transaction_repository import TransactionRepository
from app.domain.repositories.user_repository import UserRepository


class UpdateTransactionUseCase:
    """Overwrites an existing transaction's fields, creating its category on the fly if needed."""

    def __init__(
        self,
        transaction_repository: TransactionRepository,
        user_repository: UserRepository,
        create_category_use_case: CreateCategoryUseCase,
    ) -> None:
        self._transaction_repository = transaction_repository
        self._user_repository = user_repository
        self._create_category_use_case = create_category_use_case

    async def execute(self, transaction_id: int, input_data: CreateTransactionInput) -> TransactionDetail:
        existing = await self._transaction_repository.get_by_id(transaction_id)
        if existing is None:
            raise TransactionNotFoundError(f"Transaction {transaction_id} does not exist")

        user = await self._user_repository.get_by_id(input_data.user_id)
        if user is None:
            raise UserNotFoundError(f"User {input_data.user_id} does not exist")

        category = await self._create_category_use_case.execute(input_data.category_name)
        assert category.id is not None, "persisted category must have an id"

        transaction = await self._transaction_repository.update(
            Transaction(
                id=transaction_id,
                date=input_data.date,
                type=input_data.type,
                amount=input_data.amount,
                category_id=category.id,
                user_id=input_data.user_id,
                description=input_data.description,
            )
        )

        return TransactionDetail.from_parts(transaction, category, user)
