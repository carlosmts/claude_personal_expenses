final class RemoteTransactionRepository: TransactionRepository {
    private let apiClient: APIClient

    init(apiClient: APIClient) {
        self.apiClient = apiClient
    }

    func fetchAll() async throws -> [Transaction] {
        let dtos: [TransactionResponseDTO] = try await apiClient.get("transactions")
        return try dtos.map { try $0.toDomain() }
    }
}
