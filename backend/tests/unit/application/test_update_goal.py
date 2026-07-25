from decimal import Decimal

import pytest

from app.application.dto import GoalInput
from app.application.exceptions import GoalNotFoundError, UserNotFoundError
from app.application.use_cases.update_goal import UpdateGoalUseCase
from app.domain.entities.goal import Goal
from app.domain.entities.user import User
from tests.unit.application.fakes import FakeGoalRepository, FakeUserRepository


async def test_updates_existing_goal_progress() -> None:
    goal_repository = FakeGoalRepository()
    existing = await goal_repository.add(
        Goal(user_id=1, name="Vacation", target_amount=Decimal("1000.00"))
    )
    assert existing.id is not None
    use_case = UpdateGoalUseCase(goal_repository, FakeUserRepository([User(id=1, name="Carlos")]))

    detail = await use_case.execute(
        existing.id,
        GoalInput(
            user_id=1,
            name="Vacation",
            target_amount=Decimal("1000.00"),
            current_amount=Decimal("250.00"),
        ),
    )

    assert detail.current_amount == Decimal("250.00")


async def test_raises_when_goal_does_not_exist() -> None:
    use_case = UpdateGoalUseCase(FakeGoalRepository(), FakeUserRepository([User(id=1, name="Carlos")]))

    with pytest.raises(GoalNotFoundError):
        await use_case.execute(
            999,
            GoalInput(user_id=1, name="Vacation", target_amount=Decimal("1000.00")),
        )


async def test_raises_when_user_does_not_exist() -> None:
    goal_repository = FakeGoalRepository()
    existing = await goal_repository.add(
        Goal(user_id=1, name="Vacation", target_amount=Decimal("1000.00"))
    )
    assert existing.id is not None
    use_case = UpdateGoalUseCase(goal_repository, FakeUserRepository([User(id=1, name="Carlos")]))

    with pytest.raises(UserNotFoundError):
        await use_case.execute(
            existing.id,
            GoalInput(user_id=999, name="Vacation", target_amount=Decimal("1000.00")),
        )
