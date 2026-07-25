protocol UserRepository {
    func fetchAll() async throws -> [User]
}
