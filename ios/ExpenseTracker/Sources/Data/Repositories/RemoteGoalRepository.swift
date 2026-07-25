final class RemoteGoalRepository: GoalRepository {
    private let apiClient: APIClient

    init(apiClient: APIClient) {
        self.apiClient = apiClient
    }

    func fetchAll() async throws -> [Goal] {
        let dtos: [GoalResponseDTO] = try await apiClient.get("goals")
        return try dtos.map { try $0.toDomain() }
    }

    func create(_ input: GoalInput) async throws -> Goal {
        let dto: GoalResponseDTO = try await apiClient.post("goals", body: input.toDTO())
        return try dto.toDomain()
    }

    func update(id: Int, input: GoalInput) async throws -> Goal {
        let dto: GoalResponseDTO = try await apiClient.put("goals/\(id)", body: input.toDTO())
        return try dto.toDomain()
    }

    func delete(_ id: Int) async throws {
        try await apiClient.delete("goals/\(id)")
    }
}
