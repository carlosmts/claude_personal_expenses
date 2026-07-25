final class RemoteUserRepository: UserRepository {
    private let apiClient: APIClient

    init(apiClient: APIClient) {
        self.apiClient = apiClient
    }

    func fetchAll() async throws -> [User] {
        let dtos: [UserResponseDTO] = try await apiClient.get("users")
        return dtos.map { $0.toDomain() }
    }
}
