from decimal import Decimal

from app.application.use_cases.get_dashboard_summary import GetDashboardSummaryUseCase
from app.domain.entities.dashboard import DashboardSummary
from tests.unit.application.fakes import FakeDashboardRepository


async def test_returns_summary_from_repository() -> None:
    expected = DashboardSummary(
        year=2026,
        month=7,
        all_time_income=Decimal("10000.00"),
        all_time_expense=Decimal("4000.00"),
        current_month_income=Decimal("2000.00"),
        current_month_expense=Decimal("500.00"),
        previous_month_income=Decimal("2000.00"),
        previous_month_expense=Decimal("600.00"),
        previous_year_month_income=Decimal("1800.00"),
        previous_year_month_expense=Decimal("550.00"),
        monthly_breakdown=[],
    )
    use_case = GetDashboardSummaryUseCase(FakeDashboardRepository(expected))

    result = await use_case.execute(2026, 7, user_id=None)

    assert result == expected
