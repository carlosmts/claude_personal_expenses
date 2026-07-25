from dataclasses import dataclass
from datetime import date as date_
from decimal import Decimal

from app.domain.entities.category import Category
from app.domain.entities.goal import Goal
from app.domain.entities.transaction import Transaction, TransactionType
from app.domain.entities.user import User


@dataclass(frozen=True, slots=True)
class CreateTransactionInput:
    date: date_
    type: TransactionType
    amount: Decimal
    category_name: str
    user_id: int
    description: str | None = None


@dataclass(frozen=True, slots=True)
class TransactionDetail:
    """Read model for a persisted transaction, enriched with category/user names."""

    id: int
    date: date_
    type: TransactionType
    amount: Decimal
    description: str | None
    category_id: int
    category_name: str
    user_id: int
    user_name: str

    @classmethod
    def from_parts(cls, transaction: Transaction, category: Category, user: User) -> "TransactionDetail":
        assert transaction.id is not None, "persisted transaction must have an id"
        assert category.id is not None, "persisted category must have an id"
        assert user.id is not None, "persisted user must have an id"

        return cls(
            id=transaction.id,
            date=transaction.date,
            type=transaction.type,
            amount=transaction.amount,
            description=transaction.description,
            category_id=category.id,
            category_name=category.name,
            user_id=user.id,
            user_name=user.name,
        )


@dataclass(frozen=True, slots=True)
class GoalInput:
    user_id: int | None
    name: str
    target_amount: Decimal
    current_amount: Decimal = Decimal("0")


@dataclass(frozen=True, slots=True)
class GoalDetail:
    """Read model for a persisted goal, enriched with the owning user's name.

    user_id/user_name are None/"Both" for a shared goal.
    """

    id: int
    user_id: int | None
    user_name: str
    name: str
    target_amount: Decimal
    current_amount: Decimal

    @classmethod
    def from_parts(cls, goal: Goal, user: User | None) -> "GoalDetail":
        assert goal.id is not None, "persisted goal must have an id"
        if user is not None:
            assert user.id is not None, "persisted user must have an id"

        return cls(
            id=goal.id,
            user_id=user.id if user is not None else None,
            user_name=user.name if user is not None else "Both",
            name=goal.name,
            target_amount=goal.target_amount,
            current_amount=goal.current_amount,
        )
