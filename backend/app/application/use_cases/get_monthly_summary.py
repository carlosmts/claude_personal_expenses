from app.domain.entities.summary import MonthlySummary
from app.domain.repositories.summary_repository import SummaryRepository


class GetMonthlySummaryUseCase:
    def __init__(self, summary_repository: SummaryRepository) -> None:
        self._summary_repository = summary_repository

    async def execute(self, year: int, month: int) -> MonthlySummary:
        return await self._summary_repository.get_monthly_summary(year, month)
