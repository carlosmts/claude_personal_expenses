import SwiftUI

@main
struct ExpenseTrackerApp: App {
    private let dependencies = AppDependencies()

    var body: some Scene {
        WindowGroup {
            TransactionsView(viewModel: dependencies.makeTransactionsViewModel())
        }
    }
}
