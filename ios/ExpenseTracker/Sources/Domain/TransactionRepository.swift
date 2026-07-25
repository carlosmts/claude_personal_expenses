protocol TransactionRepository {
    func fetchAll() async throws -> [Transaction]
    func create(_ input: NewTransactionInput) async throws -> Transaction
    func update(id: Int, input: NewTransactionInput) async throws -> Transaction
    func delete(_ id: Int) async throws
}
