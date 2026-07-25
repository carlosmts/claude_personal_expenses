from datetime import date
from decimal import Decimal

from sqlalchemy import ColumnElement, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.entities.dashboard import DashboardSummary, MonthBreakdown
from app.domain.entities.transaction import TransactionType
from app.domain.repositories.dashboard_repository import DashboardRepository
from app.infrastructure.models.transaction_model import TransactionModel


def _month_bounds(year: int, month: int) -> tuple[date, date]:
    start = date(year, month, 1)
    end = date(year + 1, 1, 1) if month == 12 else date(year, month + 1, 1)
    return start, end


def _previous_month(year: int, month: int) -> tuple[int, int]:
    return (year - 1, 12) if month == 1 else (year, month - 1)


class SqlAlchemyDashboardRepository(DashboardRepository):
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def get_dashboard_summary(self, year: int, user_id: int | None) -> DashboardSummary:
        today = date.today()
        current_start, current_end = _month_bounds(today.year, today.month)
        prev_year, prev_month = _previous_month(today.year, today.month)
        prev_start, prev_end = _month_bounds(prev_year, prev_month)
        prev_year_month_start, prev_year_month_end = _month_bounds(today.year - 1, today.month)

        all_time_income, all_time_expense = await self._totals(user_id)
        current_month_income, current_month_expense = await self._totals(user_id, current_start, current_end)
        previous_month_income, previous_month_expense = await self._totals(user_id, prev_start, prev_end)
        previous_year_month_income, previous_year_month_expense = await self._totals(
            user_id, prev_year_month_start, prev_year_month_end
        )

        return DashboardSummary(
            year=year,
            all_time_income=all_time_income,
            all_time_expense=all_time_expense,
            current_month_income=current_month_income,
            current_month_expense=current_month_expense,
            previous_month_income=previous_month_income,
            previous_month_expense=previous_month_expense,
            previous_year_month_income=previous_year_month_income,
            previous_year_month_expense=previous_year_month_expense,
            monthly_breakdown=await self._monthly_breakdown(year, user_id),
        )

    async def _totals(
        self,
        user_id: int | None,
        start: date | None = None,
        end: date | None = None,
    ) -> tuple[Decimal, Decimal]:
        conditions: list[ColumnElement[bool]] = []
        if user_id is not None:
            conditions.append(TransactionModel.user_id == user_id)
        if start is not None:
            conditions.append(TransactionModel.date >= start)
        if end is not None:
            conditions.append(TransactionModel.date < end)

        result = await self._session.execute(
            select(TransactionModel.type, func.sum(TransactionModel.amount))
            .where(*conditions)
            .group_by(TransactionModel.type)
        )
        totals: dict[TransactionType, Decimal] = {
            transaction_type: amount for transaction_type, amount in result.all()
        }
        return totals.get(TransactionType.INCOME, Decimal("0")), totals.get(TransactionType.EXPENSE, Decimal("0"))

    async def _monthly_breakdown(self, year: int, user_id: int | None) -> list[MonthBreakdown]:
        year_start = date(year, 1, 1)
        year_end = date(year + 1, 1, 1)

        conditions: list[ColumnElement[bool]] = [
            TransactionModel.date >= year_start,
            TransactionModel.date < year_end,
        ]
        if user_id is not None:
            conditions.append(TransactionModel.user_id == user_id)

        month_expr = func.extract("month", TransactionModel.date)
        result = await self._session.execute(
            select(month_expr, TransactionModel.type, func.sum(TransactionModel.amount))
            .where(*conditions)
            .group_by(month_expr, TransactionModel.type)
        )

        income_by_month: dict[int, Decimal] = {}
        expense_by_month: dict[int, Decimal] = {}
        for month_value, transaction_type, amount in result.all():
            month = int(month_value)
            if transaction_type == TransactionType.INCOME:
                income_by_month[month] = amount
            else:
                expense_by_month[month] = amount

        return [
            MonthBreakdown(
                month=month,
                income=income_by_month.get(month, Decimal("0")),
                expense=expense_by_month.get(month, Decimal("0")),
            )
            for month in range(1, 13)
        ]
