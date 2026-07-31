from app.domain.entities.dashboard import DashboardSummary
from app.domain.repositories.dashboard_repository import DashboardRepository


class GetDashboardSummaryUseCase:
    def __init__(self, dashboard_repository: DashboardRepository) -> None:
        self._dashboard_repository = dashboard_repository

    async def execute(self, year: int, month: int, user_id: int | None) -> DashboardSummary:
        return await self._dashboard_repository.get_dashboard_summary(year, month, user_id)
