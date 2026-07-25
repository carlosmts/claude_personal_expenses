import Foundation

@MainActor
final class TransactionsViewModel: ObservableObject {
    @Published private(set) var transactions: [Transaction] = []
    @Published private(set) var categories: [Category] = []
    @Published private(set) var users: [User] = []
    @Published private(set) var isLoading = false
    @Published private(set) var isSubmitting = false
    @Published var errorMessage: String?

    private let transactionRepository: TransactionRepository
    private let categoryRepository: CategoryRepository
    private let userRepository: UserRepository

    init(
        transactionRepository: TransactionRepository,
        categoryRepository: CategoryRepository,
        userRepository: UserRepository
    ) {
        self.transactionRepository = transactionRepository
        self.categoryRepository = categoryRepository
        self.userRepository = userRepository
    }

    func loadTransactions() async {
        isLoading = true
        errorMessage = nil
        defer { isLoading = false }

        do {
            transactions = try await transactionRepository.fetchAll()
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    /// Fetches categories/users for the Add Transaction form's pickers.
    func loadFormData() async {
        do {
            async let fetchedCategories = categoryRepository.fetchAll()
            async let fetchedUsers = userRepository.fetchAll()
            categories = try await fetchedCategories
            users = try await fetchedUsers
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    @discardableResult
    func addTransaction(_ input: NewTransactionInput) async -> Bool {
        isSubmitting = true
        errorMessage = nil
        defer { isSubmitting = false }

        do {
            let created = try await transactionRepository.create(input)
            transactions.insert(created, at: 0)
            return true
        } catch {
            errorMessage = error.localizedDescription
            return false
        }
    }

    @discardableResult
    func updateTransaction(id: Int, input: NewTransactionInput) async -> Bool {
        isSubmitting = true
        errorMessage = nil
        defer { isSubmitting = false }

        do {
            let updated = try await transactionRepository.update(id: id, input: input)
            if let index = transactions.firstIndex(where: { $0.id == id }) {
                transactions[index] = updated
            }
            return true
        } catch {
            errorMessage = error.localizedDescription
            return false
        }
    }

    /// Deletes the transactions at the given offsets (from a List's .onDelete).
    /// IDs are resolved up front since `offsets` would go stale as items are removed.
    func deleteTransactions(at offsets: IndexSet) {
        let idsToDelete = offsets.map { transactions[$0].id }
        Task {
            for id in idsToDelete {
                await deleteTransaction(id: id)
            }
        }
    }

    @discardableResult
    private func deleteTransaction(id: Int) async -> Bool {
        do {
            try await transactionRepository.delete(id)
            transactions.removeAll { $0.id == id }
            return true
        } catch {
            errorMessage = error.localizedDescription
            return false
        }
    }
}
