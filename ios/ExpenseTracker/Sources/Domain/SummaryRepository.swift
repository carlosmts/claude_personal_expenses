protocol SummaryRepository {
    func fetchSummary(year: Int, month: Int) async throws -> MonthlySummary
}
