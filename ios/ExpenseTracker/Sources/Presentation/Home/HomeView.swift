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

struct HomeView: View {
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
                } else {
                    List {
                        Section {
                            BalanceCardView(balance: totalBalance)
                                .listRowInsets(EdgeInsets(top: 0, leading: 0, bottom: 12, trailing: 0))
                                .listRowBackground(Color.clear)
                                .listRowSeparator(.hidden)

                            HStack(spacing: 12) {
                                StatTileView(title: "Income (this month)", amount: monthlyIncome, tintColor: Theme.income)
                                StatTileView(title: "Expenses (this month)", amount: monthlyExpenses, tintColor: Theme.expense)
                            }
                            .listRowInsets(EdgeInsets(top: 0, leading: 0, bottom: 12, trailing: 0))
                            .listRowBackground(Color.clear)
                            .listRowSeparator(.hidden)
                        }

                        if viewModel.transactions.isEmpty {
                            Section {
                                ContentUnavailableView(
                                    "No Transactions Yet",
                                    systemImage: "tray",
                                    description: Text("Transactions you add will show up here.")
                                )
                                .listRowSeparator(.hidden)
                            }
                        } else {
                            Section("Transactions") {
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
                        }
                    }
                    .listStyle(.plain)
                    .scrollContentBackground(.hidden)
                    .background(Theme.pageBackground)
                    .refreshable {
                        await viewModel.loadTransactions()
                    }
                }
            }
            .navigationTitle("Home")
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
            .errorAlert($viewModel.errorMessage)
        }
        .task {
            await viewModel.loadTransactions()
        }
    }

    /// All-time net (every income transaction minus every expense transaction).
    private var totalBalance: Decimal {
        viewModel.transactions.reduce(Decimal(0)) { partial, transaction in
            partial + (transaction.type == .income ? transaction.amount : -transaction.amount)
        }
    }

    /// Simple client-side filter for "this calendar month" — a stopgap until
    /// the backend's monthly aggregation endpoint lands for the Report tab.
    private var currentMonthTransactions: [Transaction] {
        let calendar = Calendar.current
        let now = Date()
        return viewModel.transactions.filter {
            calendar.isDate($0.date, equalTo: now, toGranularity: .month)
        }
    }

    private var monthlyIncome: Decimal {
        currentMonthTransactions
            .filter { $0.type == .income }
            .reduce(Decimal(0)) { $0 + $1.amount }
    }

    private var monthlyExpenses: Decimal {
        currentMonthTransactions
            .filter { $0.type == .expense }
            .reduce(Decimal(0)) { $0 + $1.amount }
    }
}
