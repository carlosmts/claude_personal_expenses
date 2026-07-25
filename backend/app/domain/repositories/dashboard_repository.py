from abc import ABC, abstractmethod

from app.domain.entities.dashboard import DashboardSummary


class DashboardRepository(ABC):
    """Read-only aggregation contract for the Dashboard page."""

    @abstractmethod
    async def get_dashboard_summary(self, year: int, user_id: int | None) -> DashboardSummary: ...
