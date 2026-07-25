from fastapi import APIRouter, Query

from app.api.dependencies import GetMonthlySummaryUseCaseDep
from app.api.schemas.summary import MonthlySummaryResponse

router = APIRouter(prefix="/summary", tags=["summary"])


@router.get("", response_model=MonthlySummaryResponse)
async def get_monthly_summary(
    use_case: GetMonthlySummaryUseCaseDep,
    year: int = Query(..., ge=2000, le=2100),
    month: int = Query(..., ge=1, le=12),
) -> MonthlySummaryResponse:
    summary = await use_case.execute(year, month)
    return MonthlySummaryResponse.from_domain(summary)
