import Foundation

final class RemoteDashboardRepository: DashboardRepository {
    private let apiClient: APIClient

    init(apiClient: APIClient) {
        self.apiClient = apiClient
    }

    func fetchDashboard(year: Int, userId: Int?) async throws -> DashboardSummary {
        var queryItems = [URLQueryItem(name: "year", value: String(year))]
        if let userId {
            queryItems.append(URLQueryItem(name: "user_id", value: String(userId)))
        }
        let dto: DashboardSummaryDTO = try await apiClient.get("dashboard", queryItems: queryItems)
        return try dto.toDomain()
    }
}
