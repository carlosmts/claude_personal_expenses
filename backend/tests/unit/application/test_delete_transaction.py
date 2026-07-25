from datetime import date
from decimal import Decimal

import pytest

from app.application.exceptions import TransactionNotFoundError
from app.application.use_cases.delete_transaction import DeleteTransactionUseCase
from app.domain.entities.transaction import Transaction, TransactionType
from tests.unit.application.fakes import FakeTransactionRepository


async def test_deletes_existing_transaction() -> None:
    repository = FakeTransactionRepository()
    existing = await repository.add(
        Transaction(
            date=date(2026, 1, 1),
            type=TransactionType.EXPENSE,
            amount=Decimal("10.00"),
            category_id=1,
            user_id=1,
        )
    )
    use_case = DeleteTransactionUseCase(repository)
    assert existing.id is not None

    await use_case.execute(existing.id)

    assert await repository.list_all() == []


async def test_raises_when_transaction_does_not_exist() -> None:
    use_case = DeleteTransactionUseCase(FakeTransactionRepository())

    with pytest.raises(TransactionNotFoundError):
        await use_case.execute(999)
