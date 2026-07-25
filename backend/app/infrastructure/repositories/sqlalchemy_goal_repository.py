from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.entities.goal import Goal
from app.domain.repositories.goal_repository import GoalRepository
from app.infrastructure.models.goal_model import GoalModel


def _to_domain(model: GoalModel) -> Goal:
    return Goal(
        id=model.id,
        user_id=model.user_id,
        name=model.name,
        target_amount=model.target_amount,
        current_amount=model.current_amount,
    )


class SqlAlchemyGoalRepository(GoalRepository):
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def add(self, goal: Goal) -> Goal:
        model = GoalModel(
            user_id=goal.user_id,
            name=goal.name,
            target_amount=goal.target_amount,
            current_amount=goal.current_amount,
        )
        self._session.add(model)
        await self._session.flush()
        await self._session.refresh(model)
        return _to_domain(model)

    async def list_all(self) -> list[Goal]:
        result = await self._session.execute(select(GoalModel).order_by(GoalModel.id))
        return [_to_domain(model) for model in result.scalars()]

    async def get_by_id(self, goal_id: int) -> Goal | None:
        model = await self._session.get(GoalModel, goal_id)
        return _to_domain(model) if model else None

    async def update(self, goal: Goal) -> Goal:
        model = await self._session.get(GoalModel, goal.id)
        assert model is not None, "update() requires an existing goal id"

        model.user_id = goal.user_id
        model.name = goal.name
        model.target_amount = goal.target_amount
        model.current_amount = goal.current_amount

        await self._session.flush()
        await self._session.refresh(model)
        return _to_domain(model)

    async def delete(self, goal_id: int) -> bool:
        model = await self._session.get(GoalModel, goal_id)
        if model is None:
            return False

        await self._session.delete(model)
        await self._session.flush()
        return True
