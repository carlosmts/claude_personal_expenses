from decimal import Decimal

from app.application.use_cases.get_monthly_summary import GetMonthlySummaryUseCase
from app.domain.entities.summary import MonthlySummary
from tests.unit.application.fakes import FakeSummaryRepository


async def test_returns_summary_from_repository() -> None:
    expected = MonthlySummary(
        year=2026,
        month=7,
        total_income=Decimal("100.00"),
        total_expense=Decimal("50.00"),
        expenses_by_category=[],
        income_by_category=[],
        by_user=[],
    )
    use_case = GetMonthlySummaryUseCase(FakeSummaryRepository(expected))

    result = await use_case.execute(2026, 7)

    assert result == expected
