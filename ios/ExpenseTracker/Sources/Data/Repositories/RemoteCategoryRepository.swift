final class RemoteCategoryRepository: CategoryRepository {
    private let apiClient: APIClient

    init(apiClient: APIClient) {
        self.apiClient = apiClient
    }

    func fetchAll() async throws -> [Category] {
        let dtos: [CategoryResponseDTO] = try await apiClient.get("categories")
        return dtos.map { $0.toDomain() }
    }
}
