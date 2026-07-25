from dataclasses import dataclass
from decimal import Decimal


@dataclass(frozen=True, slots=True)
class MonthBreakdown:
    month: int
    income: Decimal
    expense: Decimal


@dataclass(frozen=True, slots=True)
class DashboardSummary:
    """Read-only aggregation for the Dashboard's top cards + yearly chart."""

    year: int
    all_time_income: Decimal
    all_time_expense: Decimal
    current_month_income: Decimal
    current_month_expense: Decimal
    previous_month_income: Decimal
    previous_month_expense: Decimal
    previous_year_month_income: Decimal
    previous_year_month_expense: Decimal
    monthly_breakdown: list[MonthBreakdown]
