protocol UserRepository {
    func fetchAll() async throws -> [User]
    func update(id: Int, name: String) async throws -> User
}
