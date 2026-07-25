from abc import ABC, abstractmethod

from app.domain.entities.summary import MonthlySummary


class SummaryRepository(ABC):
    """Read-only aggregation contract for monthly reporting."""

    @abstractmethod
    async def get_monthly_summary(self, year: int, month: int) -> MonthlySummary: ...
