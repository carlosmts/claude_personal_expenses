from app.application.exceptions import CategoryNameConflictError, CategoryNotFoundError
from app.domain.entities.category import Category
from app.domain.repositories.category_repository import CategoryRepository


class UpdateCategoryUseCase:
    def __init__(self, category_repository: CategoryRepository) -> None:
        self._category_repository = category_repository

    async def execute(self, category_id: int, new_name: str) -> Category:
        existing = await self._category_repository.get_by_id(category_id)
        if existing is None:
            raise CategoryNotFoundError(f"Category {category_id} does not exist")

        conflicting = await self._category_repository.get_by_name(new_name)
        if conflicting is not None and conflicting.id != category_id:
            raise CategoryNameConflictError(f"Category name '{new_name}' is already in use")

        return await self._category_repository.update(Category(id=category_id, name=new_name))
