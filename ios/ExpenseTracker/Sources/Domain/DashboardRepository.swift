protocol DashboardRepository {
    func fetchDashboard(year: Int, userId: Int?) async throws -> DashboardSummary
}
