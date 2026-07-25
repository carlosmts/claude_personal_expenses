import pytest

from app.application.exceptions import CategoryNameConflictError, CategoryNotFoundError
from app.application.use_cases.update_category import UpdateCategoryUseCase
from app.domain.entities.category import Category
from tests.unit.application.fakes import FakeCategoryRepository


async def test_renames_existing_category() -> None:
    repository = FakeCategoryRepository([Category(id=1, name="Groceries")])
    use_case = UpdateCategoryUseCase(repository)

    updated = await use_case.execute(1, "Supermarket")

    assert updated.name == "Supermarket"


async def test_raises_when_category_does_not_exist() -> None:
    use_case = UpdateCategoryUseCase(FakeCategoryRepository())

    with pytest.raises(CategoryNotFoundError):
        await use_case.execute(999, "Supermarket")


async def test_raises_when_new_name_conflicts_with_another_category() -> None:
    repository = FakeCategoryRepository(
        [Category(id=1, name="Groceries"), Category(id=2, name="Coffee")]
    )
    use_case = UpdateCategoryUseCase(repository)

    with pytest.raises(CategoryNameConflictError):
        await use_case.execute(1, "Coffee")


async def test_renaming_to_its_own_current_name_is_allowed() -> None:
    repository = FakeCategoryRepository([Category(id=1, name="Groceries")])
    use_case = UpdateCategoryUseCase(repository)

    updated = await use_case.execute(1, "Groceries")

    assert updated.name == "Groceries"
