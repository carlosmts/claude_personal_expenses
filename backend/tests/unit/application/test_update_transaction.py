from datetime import date
from decimal import Decimal

import pytest

from app.application.dto import CreateTransactionInput
from app.application.exceptions import TransactionNotFoundError, UserNotFoundError
from app.application.use_cases.create_category import CreateCategoryUseCase
from app.application.use_cases.update_transaction import UpdateTransactionUseCase
from app.domain.entities.category import Category
from app.domain.entities.transaction import Transaction, TransactionType
from app.domain.entities.user import User
from tests.unit.application.fakes import (
    FakeCategoryRepository,
    FakeTransactionRepository,
    FakeUserRepository,
)


def _make_use_case(
    transaction_repository: FakeTransactionRepository,
    category_repository: FakeCategoryRepository | None = None,
    user_repository: FakeUserRepository | None = None,
) -> UpdateTransactionUseCase:
    category_repository = category_repository or FakeCategoryRepository(
        [Category(id=1, name="Groceries")]
    )
    user_repository = user_repository or FakeUserRepository(
        [User(id=1, name="Carlos"), User(id=2, name="Filipa")]
    )
    return UpdateTransactionUseCase(
        transaction_repository=transaction_repository,
        user_repository=user_repository,
        create_category_use_case=CreateCategoryUseCase(category_repository),
    )


async def test_updates_existing_transaction_fields() -> None:
    transaction_repository = FakeTransactionRepository()
    existing = await transaction_repository.add(
        Transaction(
            date=date(2026, 1, 1),
            type=TransactionType.EXPENSE,
            amount=Decimal("10.00"),
            category_id=1,
            user_id=1,
        )
    )
    use_case = _make_use_case(transaction_repository)
    assert existing.id is not None

    detail = await use_case.execute(
        existing.id,
        CreateTransactionInput(
            date=date(2026, 1, 2),
            type=TransactionType.INCOME,
            amount=Decimal("99.00"),
            category_name="Salary",
            user_id=2,
        ),
    )

    assert detail.amount == Decimal("99.00")
    assert detail.type == TransactionType.INCOME
    assert detail.category_name == "Salary"
    assert detail.user_name == "Filipa"


async def test_raises_when_transaction_does_not_exist() -> None:
    use_case = _make_use_case(FakeTransactionRepository())

    with pytest.raises(TransactionNotFoundError):
        await use_case.execute(
            999,
            CreateTransactionInput(
                date=date(2026, 1, 1),
                type=TransactionType.EXPENSE,
                amount=Decimal("10.00"),
                category_name="Groceries",
                user_id=1,
            ),
        )


async def test_raises_when_user_does_not_exist() -> None:
    transaction_repository = FakeTransactionRepository()
    existing = await transaction_repository.add(
        Transaction(
            date=date(2026, 1, 1),
            type=TransactionType.EXPENSE,
            amount=Decimal("10.00"),
            category_id=1,
            user_id=1,
        )
    )
    use_case = _make_use_case(transaction_repository)
    assert existing.id is not None

    with pytest.raises(UserNotFoundError):
        await use_case.execute(
            existing.id,
            CreateTransactionInput(
                date=date(2026, 1, 1),
                type=TransactionType.EXPENSE,
                amount=Decimal("10.00"),
                category_name="Groceries",
                user_id=999,
            ),
        )
