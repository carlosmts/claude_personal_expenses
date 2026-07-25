from datetime import date
from decimal import Decimal

from sqlalchemy import ColumnElement, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.entities.summary import CategoryAmount, MonthlySummary, UserAmount
from app.domain.entities.transaction import TransactionType
from app.domain.repositories.summary_repository import SummaryRepository
from app.infrastructure.models.category_model import CategoryModel
from app.infrastructure.models.transaction_model import TransactionModel
from app.infrastructure.models.user_model import UserModel


def _month_bounds(year: int, month: int) -> tuple[date, date]:
    start = date(year, month, 1)
    end = date(year + 1, 1, 1) if month == 12 else date(year, month + 1, 1)
    return start, end


class SqlAlchemySummaryRepository(SummaryRepository):
    """Aggregates via SQL GROUP BY rather than pulling every transaction into
    Python — scales fine as transaction count grows, unlike client-side sums.
    """

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def get_monthly_summary(self, year: int, month: int) -> MonthlySummary:
        start, end = _month_bounds(year, month)
        date_filter: ColumnElement[bool] = (TransactionModel.date >= start) & (TransactionModel.date < end)

        totals_result = await self._session.execute(
            select(TransactionModel.type, func.sum(TransactionModel.amount))
            .where(date_filter)
            .group_by(TransactionModel.type)
        )
        totals_by_type: dict[TransactionType, Decimal] = {
            transaction_type: amount for transaction_type, amount in totals_result.all()
        }
        total_income = totals_by_type.get(TransactionType.INCOME, Decimal("0"))
        total_expense = totals_by_type.get(TransactionType.EXPENSE, Decimal("0"))

        return MonthlySummary(
            year=year,
            month=month,
            total_income=total_income,
            total_expense=total_expense,
            expenses_by_category=await self._category_breakdown(date_filter, TransactionType.EXPENSE),
            income_by_category=await self._category_breakdown(date_filter, TransactionType.INCOME),
            by_user=await self._user_breakdown(date_filter),
        )

    async def _category_breakdown(
        self, date_filter: ColumnElement[bool], transaction_type: TransactionType
    ) -> list[CategoryAmount]:
        result = await self._session.execute(
            select(CategoryModel.id, CategoryModel.name, func.sum(TransactionModel.amount))
            .join(TransactionModel, TransactionModel.category_id == CategoryModel.id)
            .where(date_filter, TransactionModel.type == transaction_type)
            .group_by(CategoryModel.id, CategoryModel.name)
            .order_by(func.sum(TransactionModel.amount).desc())
        )
        return [
            CategoryAmount(category_id=category_id, category_name=category_name, amount=amount)
            for category_id, category_name, amount in result.all()
        ]

    async def _user_breakdown(self, date_filter: ColumnElement[bool]) -> list[UserAmount]:
        # Every user is included, even with zero activity this month, so the
        # Plan/Report screens always show a consistent set of people.
        all_users_result = await self._session.execute(select(UserModel.id, UserModel.name).order_by(UserModel.id))
        all_users = all_users_result.all()

        totals_result = await self._session.execute(
            select(TransactionModel.user_id, TransactionModel.type, func.sum(TransactionModel.amount))
            .where(date_filter)
            .group_by(TransactionModel.user_id, TransactionModel.type)
        )

        income_by_user: dict[int, Decimal] = {}
        expense_by_user: dict[int, Decimal] = {}
        for user_id, transaction_type, amount in totals_result.all():
            if transaction_type == TransactionType.INCOME:
                income_by_user[user_id] = amount
            else:
                expense_by_user[user_id] = amount

        return [
            UserAmount(
                user_id=user_id,
                user_name=user_name,
                total_income=income_by_user.get(user_id, Decimal("0")),
                total_expense=expense_by_user.get(user_id, Decimal("0")),
            )
            for user_id, user_name in all_users
        ]
