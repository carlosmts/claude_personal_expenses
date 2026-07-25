final class RemoteTransactionRepository: TransactionRepository {
    private let apiClient: APIClient

    init(apiClient: APIClient) {
        self.apiClient = apiClient
    }

    func fetchAll() async throws -> [Transaction] {
        let dtos: [TransactionResponseDTO] = try await apiClient.get("transactions")
        return try dtos.map { try $0.toDomain() }
    }

    func create(_ input: NewTransactionInput) async throws -> Transaction {
        let dto: TransactionResponseDTO = try await apiClient.post("transactions", body: input.toDTO())
        return try dto.toDomain()
    }

    func update(id: Int, input: NewTransactionInput) async throws -> Transaction {
        let dto: TransactionResponseDTO = try await apiClient.put("transactions/\(id)", body: input.toDTO())
        return try dto.toDomain()
    }

    func delete(_ id: Int) async throws {
        try await apiClient.delete("transactions/\(id)")
    }
}
