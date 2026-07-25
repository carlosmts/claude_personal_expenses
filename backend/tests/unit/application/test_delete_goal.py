from decimal import Decimal

import pytest

from app.application.exceptions import GoalNotFoundError
from app.application.use_cases.delete_goal import DeleteGoalUseCase
from app.domain.entities.goal import Goal
from tests.unit.application.fakes import FakeGoalRepository


async def test_deletes_existing_goal() -> None:
    repository = FakeGoalRepository()
    existing = await repository.add(
        Goal(user_id=1, name="Vacation", target_amount=Decimal("1000.00"))
    )
    assert existing.id is not None
    use_case = DeleteGoalUseCase(repository)

    await use_case.execute(existing.id)

    assert await repository.list_all() == []


async def test_raises_when_goal_does_not_exist() -> None:
    use_case = DeleteGoalUseCase(FakeGoalRepository())

    with pytest.raises(GoalNotFoundError):
        await use_case.execute(999)
