from app.application.dto import GoalDetail, GoalInput
from app.application.exceptions import GoalNotFoundError, UserNotFoundError
from app.domain.entities.goal import Goal
from app.domain.repositories.goal_repository import GoalRepository
from app.domain.repositories.user_repository import UserRepository


class UpdateGoalUseCase:
    def __init__(self, goal_repository: GoalRepository, user_repository: UserRepository) -> None:
        self._goal_repository = goal_repository
        self._user_repository = user_repository

    async def execute(self, goal_id: int, input_data: GoalInput) -> GoalDetail:
        existing = await self._goal_repository.get_by_id(goal_id)
        if existing is None:
            raise GoalNotFoundError(f"Goal {goal_id} does not exist")

        user = await self._user_repository.get_by_id(input_data.user_id)
        if user is None:
            raise UserNotFoundError(f"User {input_data.user_id} does not exist")

        goal = await self._goal_repository.update(
            Goal(
                id=goal_id,
                user_id=input_data.user_id,
                name=input_data.name,
                target_amount=input_data.target_amount,
                current_amount=input_data.current_amount,
            )
        )

        return GoalDetail.from_parts(goal, user)
