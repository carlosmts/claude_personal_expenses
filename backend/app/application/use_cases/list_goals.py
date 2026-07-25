from app.application.dto import GoalDetail
from app.domain.repositories.goal_repository import GoalRepository
from app.domain.repositories.user_repository import UserRepository


class ListGoalsUseCase:
    def __init__(self, goal_repository: GoalRepository, user_repository: UserRepository) -> None:
        self._goal_repository = goal_repository
        self._user_repository = user_repository

    async def execute(self) -> list[GoalDetail]:
        goals = await self._goal_repository.list_all()
        users_by_id = {user.id: user for user in await self._user_repository.list_all()}
        return [
            GoalDetail.from_parts(goal, users_by_id.get(goal.user_id) if goal.user_id is not None else None)
            for goal in goals
        ]
