from decimal import Decimal

from app.application.use_cases.list_goals import ListGoalsUseCase
from app.domain.entities.goal import Goal
from app.domain.entities.user import User
from tests.unit.application.fakes import FakeGoalRepository, FakeUserRepository


async def test_lists_goals_enriched_with_user_name() -> None:
    goal_repository = FakeGoalRepository()
    await goal_repository.add(Goal(user_id=1, name="Vacation", target_amount=Decimal("1000.00")))
    await goal_repository.add(Goal(user_id=2, name="New Bike", target_amount=Decimal("500.00")))
    use_case = ListGoalsUseCase(
        goal_repository,
        FakeUserRepository([User(id=1, name="Carlos"), User(id=2, name="Filipa")]),
    )

    details = await use_case.execute()

    assert [detail.user_name for detail in details] == ["Carlos", "Filipa"]


async def test_lists_shared_goal_with_both_as_user_name() -> None:
    goal_repository = FakeGoalRepository()
    await goal_repository.add(
        Goal(user_id=None, name="House by the Sea", target_amount=Decimal("50000.00"))
    )
    use_case = ListGoalsUseCase(goal_repository, FakeUserRepository([]))

    details = await use_case.execute()

    assert details[0].user_id is None
    assert details[0].user_name == "Both"
