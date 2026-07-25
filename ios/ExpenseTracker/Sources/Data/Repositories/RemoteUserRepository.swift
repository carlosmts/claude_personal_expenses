final class RemoteUserRepository: UserRepository {
    private let apiClient: APIClient

    init(apiClient: APIClient) {
        self.apiClient = apiClient
    }

    func fetchAll() async throws -> [User] {
        let dtos: [UserResponseDTO] = try await apiClient.get("users")
        return dtos.map { $0.toDomain() }
    }

    func update(id: Int, name: String) async throws -> User {
        let dto: UserResponseDTO = try await apiClient.put(
            "users/\(id)",
            body: UserRenameRequestDTO(name: name)
        )
        return dto.toDomain()
    }
}
