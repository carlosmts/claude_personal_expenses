from app.application.dto import GoalDetail, GoalInput
from app.application.use_cases._shared import resolve_optional_user
from app.domain.entities.goal import Goal
from app.domain.repositories.goal_repository import GoalRepository
from app.domain.repositories.user_repository import UserRepository


class CreateGoalUseCase:
    def __init__(self, goal_repository: GoalRepository, user_repository: UserRepository) -> None:
        self._goal_repository = goal_repository
        self._user_repository = user_repository

    async def execute(self, input_data: GoalInput) -> GoalDetail:
        user = await resolve_optional_user(input_data.user_id, self._user_repository)

        goal = await self._goal_repository.add(
            Goal(
                user_id=input_data.user_id,
                name=input_data.name,
                target_amount=input_data.target_amount,
                current_amount=input_data.current_amount,
            )
        )

        return GoalDetail.from_parts(goal, user)
