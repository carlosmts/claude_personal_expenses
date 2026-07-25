protocol CategoryRepository {
    func fetchAll() async throws -> [Category]
}
