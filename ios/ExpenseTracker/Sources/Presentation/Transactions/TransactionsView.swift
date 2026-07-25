import SwiftUI

struct TransactionsView: View {
    @StateObject private var viewModel: TransactionsViewModel

    init(viewModel: TransactionsViewModel) {
        _viewModel = StateObject(wrappedValue: viewModel)
    }

    var body: some View {
        NavigationStack {
            Group {
                if viewModel.isLoading && viewModel.transactions.isEmpty {
                    ProgressView()
                } else if viewModel.transactions.isEmpty {
                    ContentUnavailableView(
                        "No Transactions Yet",
                        systemImage: "tray",
                        description: Text("Transactions you add will show up here.")
                    )
                } else {
                    List(viewModel.transactions) { transaction in
                        TransactionRowView(transaction: transaction)
                    }
                    .refreshable {
                        await viewModel.loadTransactions()
                    }
                }
            }
            .navigationTitle("Transactions")
            .alert(
                "Something went wrong",
                isPresented: .constant(viewModel.errorMessage != nil),
                actions: {
                    Button("OK") { viewModel.errorMessage = nil }
                },
                message: {
                    Text(viewModel.errorMessage ?? "")
                }
            )
        }
        .task {
            await viewModel.loadTransactions()
        }
    }
}
