from decimal import Decimal

from pydantic import BaseModel

from app.domain.entities.summary import CategoryAmount, MonthlySummary, UserAmount


class CategoryAmountResponse(BaseModel):
    category_id: int
    category_name: str
    amount: Decimal

    @classmethod
    def from_domain(cls, category_amount: CategoryAmount) -> "CategoryAmountResponse":
        return cls(
            category_id=category_amount.category_id,
            category_name=category_amount.category_name,
            amount=category_amount.amount,
        )


class UserAmountResponse(BaseModel):
    user_id: int
    user_name: str
    total_income: Decimal
    total_expense: Decimal

    @classmethod
    def from_domain(cls, user_amount: UserAmount) -> "UserAmountResponse":
        return cls(
            user_id=user_amount.user_id,
            user_name=user_amount.user_name,
            total_income=user_amount.total_income,
            total_expense=user_amount.total_expense,
        )


class MonthlySummaryResponse(BaseModel):
    year: int
    month: int
    total_income: Decimal
    total_expense: Decimal
    expenses_by_category: list[CategoryAmountResponse]
    income_by_category: list[CategoryAmountResponse]
    by_user: list[UserAmountResponse]

    @classmethod
    def from_domain(cls, summary: MonthlySummary) -> "MonthlySummaryResponse":
        return cls(
            year=summary.year,
            month=summary.month,
            total_income=summary.total_income,
            total_expense=summary.total_expense,
            expenses_by_category=[
                CategoryAmountResponse.from_domain(c) for c in summary.expenses_by_category
            ],
            income_by_category=[
                CategoryAmountResponse.from_domain(c) for c in summary.income_by_category
            ],
            by_user=[UserAmountResponse.from_domain(u) for u in summary.by_user],
        )
