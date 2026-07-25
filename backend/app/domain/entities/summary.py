from dataclasses import dataclass
from decimal import Decimal


@dataclass(frozen=True, slots=True)
class CategoryAmount:
    category_id: int
    category_name: str
    amount: Decimal


@dataclass(frozen=True, slots=True)
class UserAmount:
    user_id: int
    user_name: str
    total_income: Decimal
    total_expense: Decimal


@dataclass(frozen=True, slots=True)
class MonthlySummary:
    """Read-only aggregation for a given calendar month — not a persisted entity."""

    year: int
    month: int
    total_income: Decimal
    total_expense: Decimal
    expenses_by_category: list[CategoryAmount]
    income_by_category: list[CategoryAmount]
    by_user: list[UserAmount]
