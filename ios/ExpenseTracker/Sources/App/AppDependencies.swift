import Foundation

/// Composition root: wires concrete repositories into view models.
/// Kept as plain factory methods (no DI framework) given the app's small surface area.
final class AppDependencies {
    private let apiClient: APIClient
    private let transactionRepository: TransactionRepository
    private let categoryRepository: CategoryRepository
    private let userRepository: UserRepository
    private let summaryRepository: SummaryRepository

    init() {
        apiClient = APIClient(baseURL: APIConfiguration.baseURL)
        transactionRepository = RemoteTransactionRepository(apiClient: apiClient)
        categoryRepository = RemoteCategoryRepository(apiClient: apiClient)
        userRepository = RemoteUserRepository(apiClient: apiClient)
        summaryRepository = RemoteSummaryRepository(apiClient: apiClient)
    }

    @MainActor
    func makeTransactionsViewModel() -> TransactionsViewModel {
        TransactionsViewModel(
            transactionRepository: transactionRepository,
            categoryRepository: categoryRepository,
            userRepository: userRepository
        )
    }

    @MainActor
    func makeReportViewModel() -> ReportViewModel {
        ReportViewModel(summaryRepository: summaryRepository)
    }
}
