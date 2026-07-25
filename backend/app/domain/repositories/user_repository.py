from abc import ABC, abstractmethod

from app.domain.entities.user import User


class UserRepository(ABC):
    """Persistence contract for users, independent of any DB technology."""

    @abstractmethod
    async def list_all(self) -> list[User]: ...

    @abstractmethod
    async def get_by_id(self, user_id: int) -> User | None: ...

    @abstractmethod
    async def update(self, user: User) -> User: ...
