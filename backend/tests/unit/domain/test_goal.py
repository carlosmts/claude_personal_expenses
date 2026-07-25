from decimal import Decimal

import pytest

from app.domain.entities.goal import Goal


def test_goal_accepts_valid_values() -> None:
    goal = Goal(user_id=1, name="Vacation", target_amount=Decimal("1000.00"))

    assert goal.current_amount == Decimal("0")


@pytest.mark.parametrize("name", ["", "   "])
def test_goal_rejects_empty_name(name: str) -> None:
    with pytest.raises(ValueError, match="empty"):
        Goal(user_id=1, name=name, target_amount=Decimal("1000.00"))


@pytest.mark.parametrize("target_amount", [Decimal("0"), Decimal("-10.00")])
def test_goal_rejects_non_positive_target(target_amount: Decimal) -> None:
    with pytest.raises(ValueError, match="positive"):
        Goal(user_id=1, name="Vacation", target_amount=target_amount)


def test_goal_rejects_negative_current_amount() -> None:
    with pytest.raises(ValueError, match="negative"):
        Goal(user_id=1, name="Vacation", target_amount=Decimal("1000.00"), current_amount=Decimal("-1.00"))
