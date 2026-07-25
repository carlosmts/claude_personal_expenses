protocol CategoryRepository {
    func fetchAll() async throws -> [Category]
    func update(id: Int, name: String) async throws -> Category
    func delete(_ id: Int) async throws
}
