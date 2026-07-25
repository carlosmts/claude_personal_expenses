import Foundation

/// Composition root: wires concrete repositories into view models.
/// Kept as plain factory methods (no DI framework) given the app's small surface area.
final class AppDependencies {
    private let apiClient: APIClient
    private let transactionRepository: TransactionRepository

    init() {
        apiClient = APIClient(baseURL: APIConfiguration.baseURL)
        transactionRepository = RemoteTransactionRepository(apiClient: apiClient)
    }

    @MainActor
    func makeTransactionsViewModel() -> TransactionsViewModel {
        TransactionsViewModel(transactionRepository: transactionRepository)
    }
}
