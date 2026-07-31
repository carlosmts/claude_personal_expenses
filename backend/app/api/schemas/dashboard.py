from decimal import Decimal

from pydantic import BaseModel

from app.domain.entities.dashboard import DashboardSummary, MonthBreakdown


class MonthBreakdownResponse(BaseModel):
    month: int
    income: Decimal
    expense: Decimal

    @classmethod
    def from_domain(cls, breakdown: MonthBreakdown) -> "MonthBreakdownResponse":
        return cls(month=breakdown.month, income=breakdown.income, expense=breakdown.expense)


class DashboardSummaryResponse(BaseModel):
    year: int
    month: int
    all_time_income: Decimal
    all_time_expense: Decimal
    current_month_income: Decimal
    current_month_expense: Decimal
    previous_month_income: Decimal
    previous_month_expense: Decimal
    previous_year_month_income: Decimal
    previous_year_month_expense: Decimal
    monthly_breakdown: list[MonthBreakdownResponse]

    @classmethod
    def from_domain(cls, summary: DashboardSummary) -> "DashboardSummaryResponse":
        return cls(
            year=summary.year,
            month=summary.month,
            all_time_income=summary.all_time_income,
            all_time_expense=summary.all_time_expense,
            current_month_income=summary.current_month_income,
            current_month_expense=summary.current_month_expense,
            previous_month_income=summary.previous_month_income,
            previous_month_expense=summary.previous_month_expense,
            previous_year_month_income=summary.previous_year_month_income,
            previous_year_month_expense=summary.previous_year_month_expense,
            monthly_breakdown=[
                MonthBreakdownResponse.from_domain(breakdown) for breakdown in summary.monthly_breakdown
            ],
        )
