from abc import ABC, abstractmethod

from app.domain.entities.category import Category


class CategoryRepository(ABC):
    """Persistence contract for categories, independent of any DB technology."""

    @abstractmethod
    async def add(self, category: Category) -> Category: ...

    @abstractmethod
    async def list_all(self) -> list[Category]: ...

    @abstractmethod
    async def get_by_name(self, name: str) -> Category | None: ...

    @abstractmethod
    async def get_by_id(self, category_id: int) -> Category | None: ...

    @abstractmethod
    async def update(self, category: Category) -> Category: ...

    @abstractmethod
    async def delete(self, category_id: int) -> bool: ...
