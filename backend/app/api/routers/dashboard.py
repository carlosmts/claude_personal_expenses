from datetime import date

from fastapi import APIRouter, Query

from app.api.dependencies import GetDashboardSummaryUseCaseDep
from app.api.schemas.dashboard import DashboardSummaryResponse

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("", response_model=DashboardSummaryResponse)
async def get_dashboard_summary(
    use_case: GetDashboardSummaryUseCaseDep,
    year: int = Query(default_factory=lambda: date.today().year, ge=2000, le=2100),
    month: int = Query(default_factory=lambda: date.today().month, ge=1, le=12),
    user_id: int | None = Query(default=None),
) -> DashboardSummaryResponse:
    summary = await use_case.execute(year, month, user_id)
    return DashboardSummaryResponse.from_domain(summary)
