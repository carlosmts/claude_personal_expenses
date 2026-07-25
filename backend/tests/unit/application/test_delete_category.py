from datetime import date
from decimal import Decimal

import pytest

from app.application.exceptions import CategoryInUseError, CategoryNotFoundError
from app.application.use_cases.delete_category import DeleteCategoryUseCase
from app.domain.entities.category import Category
from app.domain.entities.transaction import Transaction, TransactionType
from tests.unit.application.fakes import FakeCategoryRepository, FakeTransactionRepository


async def test_deletes_unused_category() -> None:
    category_repository = FakeCategoryRepository([Category(id=1, name="Groceries")])
    use_case = DeleteCategoryUseCase(category_repository, FakeTransactionRepository())

    await use_case.execute(1)

    assert await category_repository.list_all() == []


async def test_raises_when_category_does_not_exist() -> None:
    use_case = DeleteCategoryUseCase(FakeCategoryRepository(), FakeTransactionRepository())

    with pytest.raises(CategoryNotFoundError):
        await use_case.execute(999)


async def test_raises_when_category_still_has_transactions() -> None:
    category_repository = FakeCategoryRepository([Category(id=1, name="Groceries")])
    transaction_repository = FakeTransactionRepository()
    await transaction_repository.add(
        Transaction(
            date=date(2026, 1, 1),
            type=TransactionType.EXPENSE,
            amount=Decimal("10.00"),
            category_id=1,
            user_id=1,
        )
    )
    use_case = DeleteCategoryUseCase(category_repository, transaction_repository)

    with pytest.raises(CategoryInUseError):
        await use_case.execute(1)

    assert await category_repository.get_by_id(1) is not None
