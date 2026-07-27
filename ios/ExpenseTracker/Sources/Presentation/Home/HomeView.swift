import SwiftUI

/// Which form sheet is presented, and with what data — a single piece of
/// state driving one `.sheet(item:)` instead of separate add/edit sheets.
private enum TransactionFormMode: Identifiable, Equatable {
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
    @StateObject private var dashboardViewModel: DashboardViewModel
    @State private var formMode: TransactionFormMode?
    @State private var pendingDeleteOffsets: IndexSet?

    init(viewModel: TransactionsViewModel, dashboardViewModel: DashboardViewModel) {
        _viewModel = StateObject(wrappedValue: viewModel)
        _dashboardViewModel = StateObject(wrappedValue: dashboardViewModel)
    }

    var body: some View {
        NavigationStack {
            Group {
                if viewModel.isLoading && viewModel.transactions.isEmpty {
                    ProgressView()
                } else {
                    List {
                        Section {
                            if !dashboardViewModel.users.isEmpty {
                                Picker("Person", selection: $dashboardViewModel.selectedUserId) {
                                    Text("All").tag(Optional<Int>.none)
                                    ForEach(dashboardViewModel.users) { user in
                                        Text(user.name).tag(Optional(user.id))
                                    }
                                }
                                .pickerStyle(.segmented)
                                .listRowInsets(EdgeInsets(top: 0, leading: 0, bottom: 12, trailing: 0))
                                .listRowBackground(Color.clear)
                                .listRowSeparator(.hidden)
                            }

                            if let summary = dashboardViewModel.summary {
                                BalanceCardView(
                                    balance: summary.allTimeIncome - summary.allTimeExpense,
                                    growthVsLastMonth: percentChange(
                                        current: summary.currentMonthIncome - summary.currentMonthExpense,
                                        previous: summary.previousMonthIncome - summary.previousMonthExpense
                                    ),
                                    growthVsLastYear: percentChange(
                                        current: summary.currentMonthIncome - summary.currentMonthExpense,
                                        previous: summary.previousYearMonthIncome - summary.previousYearMonthExpense
                                    ),
                                    monthlyBreakdown: summary.monthlyBreakdown
                                )
                                .listRowInsets(EdgeInsets(top: 0, leading: 0, bottom: 12, trailing: 0))
                                .listRowBackground(Color.clear)
                                .listRowSeparator(.hidden)

                                HStack(spacing: 12) {
                                    StatTileView(
                                        title: "Income (this month)",
                                        amount: summary.currentMonthIncome,
                                        tintColor: Theme.income,
                                        growthPercent: percentChange(
                                            current: summary.currentMonthIncome,
                                            previous: summary.previousMonthIncome
                                        ),
                                        positiveIsGood: true
                                    )
                                    StatTileView(
                                        title: "Expenses (this month)",
                                        amount: summary.currentMonthExpense,
                                        tintColor: Theme.expense,
                                        growthPercent: percentChange(
                                            current: summary.currentMonthExpense,
                                            previous: summary.previousMonthExpense
                                        ),
                                        positiveIsGood: false
                                    )
                                }
                                .listRowInsets(EdgeInsets(top: 0, leading: 0, bottom: 12, trailing: 0))
                                .listRowBackground(Color.clear)
                                .listRowSeparator(.hidden)

                                MonthlyBarChartView(breakdown: summary.monthlyBreakdown)
                                    .frame(height: 220)
                                    .padding()
                                    .cardStyle()
                                    .listRowInsets(EdgeInsets(top: 0, leading: 0, bottom: 0, trailing: 0))
                                    .listRowBackground(Color.clear)
                                    .listRowSeparator(.hidden)
                            } else if dashboardViewModel.isLoading {
                                ProgressView()
                                    .frame(maxWidth: .infinity)
                                    .listRowBackground(Color.clear)
                                    .listRowSeparator(.hidden)
                            }
                        }

                        if filteredTransactions.isEmpty {
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
                                ForEach(filteredTransactions) { transaction in
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
                        async let transactionsReload: Void = viewModel.loadTransactions()
                        async let dashboardReload: Void = dashboardViewModel.load()
                        _ = await (transactionsReload, dashboardReload)
                    }
                }
            }
            .navigationTitle("Dashboard")
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
            .onChange(of: formMode) { _, newValue in
                if newValue == nil {
                    Task { await dashboardViewModel.loadSummary() }
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
                            Task { await dashboardViewModel.loadSummary() }
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
            .errorAlert($dashboardViewModel.errorMessage)
        }
        .task {
            await viewModel.loadTransactions()
        }
        .task {
            await dashboardViewModel.load()
        }
    }

    /// Transactions filtered by the dashboard's person picker — nil selection means "All".
    private var filteredTransactions: [Transaction] {
        guard let selectedUserId = dashboardViewModel.selectedUserId else {
            return viewModel.transactions
        }
        return viewModel.transactions.filter { $0.userId == selectedUserId }
    }
}
