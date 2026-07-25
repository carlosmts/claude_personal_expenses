from decimal import Decimal

import pytest

from app.application.dto import GoalInput
from app.application.exceptions import UserNotFoundError
from app.application.use_cases.create_goal import CreateGoalUseCase
from app.domain.entities.user import User
from tests.unit.application.fakes import FakeGoalRepository, FakeUserRepository


async def test_creates_goal_for_existing_user() -> None:
    use_case = CreateGoalUseCase(
        FakeGoalRepository(), FakeUserRepository([User(id=1, name="Carlos")])
    )

    detail = await use_case.execute(
        GoalInput(user_id=1, name="Vacation", target_amount=Decimal("1000.00"))
    )

    assert detail.user_name == "Carlos"
    assert detail.current_amount == Decimal("0")


async def test_raises_when_user_does_not_exist() -> None:
    use_case = CreateGoalUseCase(FakeGoalRepository(), FakeUserRepository([]))

    with pytest.raises(UserNotFoundError):
        await use_case.execute(
            GoalInput(user_id=999, name="Vacation", target_amount=Decimal("1000.00"))
        )
