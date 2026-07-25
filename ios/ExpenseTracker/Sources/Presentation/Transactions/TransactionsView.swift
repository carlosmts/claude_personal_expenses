import SwiftUI

/// Which form sheet is presented, and with what data — a single piece of
/// state driving one `.sheet(item:)` instead of separate add/edit sheets.
private enum TransactionFormMode: Identifiable {
    case add
    case edit(Transaction)

    var id: String {
        switch self {
        case .add:
            return "add"
        case let .edit(transaction):
            return "edit-\(transaction.id)"
        }
    }
}

struct TransactionsView: View {
    @StateObject private var viewModel: TransactionsViewModel
    @State private var formMode: TransactionFormMode?
    @State private var pendingDeleteOffsets: IndexSet?

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
                    List {
                        ForEach(viewModel.transactions) { transaction in
                            Button {
                                formMode = .edit(transaction)
                            } label: {
                                TransactionRowView(transaction: transaction)
                            }
                            .buttonStyle(.plain)
                        }
                        .onDelete { offsets in
                            pendingDeleteOffsets = offsets
                        }
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
                        formMode = .add
                    } label: {
                        Image(systemName: "plus")
                    }
                }
            }
            .sheet(item: $formMode) { mode in
                switch mode {
                case .add:
                    TransactionFormView(viewModel: viewModel)
                case let .edit(transaction):
                    TransactionFormView(viewModel: viewModel, editingTransaction: transaction)
                }
            }
            .alert(
                "Delete Transaction?",
                isPresented: Binding(
                    get: { pendingDeleteOffsets != nil },
                    set: { isPresented in
                        if !isPresented { pendingDeleteOffsets = nil }
                    }
                ),
                actions: {
                    Button("Delete", role: .destructive) {
                        if let offsets = pendingDeleteOffsets {
                            viewModel.deleteTransactions(at: offsets)
                        }
                        pendingDeleteOffsets = nil
                    }
                    Button("Cancel", role: .cancel) {
                        pendingDeleteOffsets = nil
                    }
                },
                message: {
                    Text("This can't be undone.")
                }
            )
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
