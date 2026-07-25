from app.domain.entities.category import Category
from app.domain.repositories.category_repository import CategoryRepository


class CreateCategoryUseCase:
    """Returns the existing category matching this name, or creates a new one."""

    def __init__(self, category_repository: CategoryRepository) -> None:
        self._category_repository = category_repository

    async def execute(self, name: str) -> Category:
        existing = await self._category_repository.get_by_name(name)
        if existing is not None:
            return existing
        return await self._category_repository.add(Category(name=name))
