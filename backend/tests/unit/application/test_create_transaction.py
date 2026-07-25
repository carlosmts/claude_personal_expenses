from datetime import date
from decimal import Decimal

import pytest

from app.application.dto import CreateTransactionInput
from app.application.exceptions import UserNotFoundError
from app.application.use_cases.create_category import CreateCategoryUseCase
from app.application.use_cases.create_transaction import CreateTransactionUseCase
from app.domain.entities.category import Category
from app.domain.entities.transaction import TransactionType
from app.domain.entities.user import User
from tests.unit.application.fakes import (
    FakeCategoryRepository,
    FakeTransactionRepository,
    FakeUserRepository,
)


def _make_use_case(
    category_repository: FakeCategoryRepository | None = None,
    user_repository: FakeUserRepository | None = None,
) -> CreateTransactionUseCase:
    category_repository = category_repository or FakeCategoryRepository()
    user_repository = user_repository or FakeUserRepository([User(id=1, name="Carlos")])
    return CreateTransactionUseCase(
        transaction_repository=FakeTransactionRepository(),
        user_repository=user_repository,
        create_category_use_case=CreateCategoryUseCase(category_repository),
    )


async def test_creates_category_when_it_does_not_exist() -> None:
    category_repository = FakeCategoryRepository()
    use_case = _make_use_case(category_repository=category_repository)

    detail = await use_case.execute(
        CreateTransactionInput(
            date=date(2026, 1, 1),
            type=TransactionType.EXPENSE,
            amount=Decimal("42.00"),
            category_name="Groceries",
            user_id=1,
        )
    )

    assert detail.category_name == "Groceries"
    assert await category_repository.get_by_name("Groceries") is not None


async def test_reuses_existing_category_by_name() -> None:
    category_repository = FakeCategoryRepository([Category(id=1, name="Groceries")])
    use_case = _make_use_case(category_repository=category_repository)

    detail = await use_case.execute(
        CreateTransactionInput(
            date=date(2026, 1, 1),
            type=TransactionType.EXPENSE,
            amount=Decimal("10.00"),
            category_name="Groceries",
            user_id=1,
        )
    )

    assert detail.category_id == 1
    assert len(await category_repository.list_all()) == 1


async def test_raises_when_user_does_not_exist() -> None:
    use_case = _make_use_case(user_repository=FakeUserRepository([]))

    with pytest.raises(UserNotFoundError):
        await use_case.execute(
            CreateTransactionInput(
                date=date(2026, 1, 1),
                type=TransactionType.EXPENSE,
                amount=Decimal("10.00"),
                category_name="Groceries",
                user_id=999,
            )
        )
