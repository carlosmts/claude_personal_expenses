from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.entities.category import Category
from app.domain.repositories.category_repository import CategoryRepository
from app.infrastructure.models.category_model import CategoryModel


def _to_domain(model: CategoryModel) -> Category:
    return Category(id=model.id, name=model.name)


class SqlAlchemyCategoryRepository(CategoryRepository):
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def add(self, category: Category) -> Category:
        model = CategoryModel(name=category.name)
        self._session.add(model)
        await self._session.flush()
        await self._session.refresh(model)
        return _to_domain(model)

    async def list_all(self) -> list[Category]:
        result = await self._session.execute(select(CategoryModel).order_by(CategoryModel.name))
        return [_to_domain(model) for model in result.scalars()]

    async def get_by_name(self, name: str) -> Category | None:
        result = await self._session.execute(select(CategoryModel).where(CategoryModel.name == name))
        model = result.scalar_one_or_none()
        return _to_domain(model) if model else None

    async def get_by_id(self, category_id: int) -> Category | None:
        model = await self._session.get(CategoryModel, category_id)
        return _to_domain(model) if model else None
