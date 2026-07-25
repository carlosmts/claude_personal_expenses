from app.application.exceptions import GoalNotFoundError
from app.domain.repositories.goal_repository import GoalRepository


class DeleteGoalUseCase:
    def __init__(self, goal_repository: GoalRepository) -> None:
        self._goal_repository = goal_repository

    async def execute(self, goal_id: int) -> None:
        deleted = await self._goal_repository.delete(goal_id)
        if not deleted:
            raise GoalNotFoundError(f"Goal {goal_id} does not exist")
