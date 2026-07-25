import SwiftUI

struct TransactionsView: View {
    @StateObject private var viewModel: TransactionsViewModel
    @State private var isPresentingAddTransaction = false

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
            .toolbar {
                ToolbarItem(placement: .primaryAction) {
                    Button {
                        isPresentingAddTransaction = true
                    } label: {
                        Image(systemName: "plus")
                    }
                }
            }
            .sheet(isPresented: $isPresentingAddTransaction) {
                AddTransactionView(viewModel: viewModel)
            }
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
