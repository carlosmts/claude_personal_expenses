protocol TransactionRepository {
    func fetchAll() async throws -> [Transaction]
}
