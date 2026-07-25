from app.domain.entities.category import Category
from app.domain.repositories.category_repository import CategoryRepository


class ListCategoriesUseCase:
    def __init__(self, category_repository: CategoryRepository) -> None:
        self._category_repository = category_repository

    async def execute(self) -> list[Category]:
        return await self._category_repository.list_all()
