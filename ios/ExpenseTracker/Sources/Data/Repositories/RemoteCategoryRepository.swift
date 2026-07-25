final class RemoteCategoryRepository: CategoryRepository {
    private let apiClient: APIClient

    init(apiClient: APIClient) {
        self.apiClient = apiClient
    }

    func fetchAll() async throws -> [Category] {
        let dtos: [CategoryResponseDTO] = try await apiClient.get("categories")
        return dtos.map { $0.toDomain() }
    }

    func update(id: Int, name: String) async throws -> Category {
        let dto: CategoryResponseDTO = try await apiClient.put(
            "categories/\(id)",
            body: CategoryRenameRequestDTO(name: name)
        )
        return dto.toDomain()
    }

    func delete(_ id: Int) async throws {
        try await apiClient.delete("categories/\(id)")
    }
}
