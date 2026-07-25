protocol TransactionRepository {
    func fetchAll() async throws -> [Transaction]
    func create(_ input: NewTransactionInput) async throws -> Transaction
}
