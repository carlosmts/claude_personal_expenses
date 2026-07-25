from abc import ABC, abstractmethod

from app.domain.entities.goal import Goal


class GoalRepository(ABC):
    """Persistence contract for savings goals, independent of any DB technology."""

    @abstractmethod
    async def add(self, goal: Goal) -> Goal: ...

    @abstractmethod
    async def list_all(self) -> list[Goal]: ...

    @abstractmethod
    async def get_by_id(self, goal_id: int) -> Goal | None: ...

    @abstractmethod
    async def update(self, goal: Goal) -> Goal: ...

    @abstractmethod
    async def delete(self, goal_id: int) -> bool: ...
