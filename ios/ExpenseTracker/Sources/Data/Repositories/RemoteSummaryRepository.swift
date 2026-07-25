import Foundation

final class RemoteSummaryRepository: SummaryRepository {
    private let apiClient: APIClient

    init(apiClient: APIClient) {
        self.apiClient = apiClient
    }

    func fetchSummary(year: Int, month: Int) async throws -> MonthlySummary {
        let dto: MonthlySummaryDTO = try await apiClient.get(
            "summary",
            queryItems: [
                URLQueryItem(name: "year", value: String(year)),
                URLQueryItem(name: "month", value: String(month)),
            ]
        )
        return try dto.toDomain()
    }
}
