import SwiftUI

struct ReportView: View {
    @StateObject private var viewModel: ReportViewModel
    @State private var selectedType: TransactionType = .expense

    init(viewModel: ReportViewModel) {
        _viewModel = StateObject(wrappedValue: viewModel)
    }

    var body: some View {
        NavigationStack {
            Group {
                if viewModel.isLoading && viewModel.summary == nil {
                    ProgressView()
                } else if let summary = viewModel.summary {
                    content(for: summary)
                } else {
                    ContentUnavailableView("No Data", systemImage: "chart.pie")
                }
            }
            .navigationTitle("Report")
            .toolbar {
                ToolbarItem(placement: .principal) {
                    monthNavigator
                }
            }
            .errorAlert($viewModel.errorMessage)
        }
        .task {
            await viewModel.load()
        }
    }

    private var monthNavigator: some View {
        HStack(spacing: 16) {
            Button {
                viewModel.goToPreviousMonth()
            } label: {
                Image(systemName: "chevron.left")
            }

            Text(viewModel.monthTitle)
                .font(.headline)
                .frame(minWidth: 140)

            Button {
                viewModel.goToNextMonth()
            } label: {
                Image(systemName: "chevron.right")
            }
        }
    }

    @ViewBuilder
    private func content(for summary: MonthlySummary) -> some View {
        let categories = selectedType == .expense ? summary.expensesByCategory : summary.incomeByCategory
        let total = selectedType == .expense ? summary.totalExpense : summary.totalIncome

        ScrollView {
            VStack(spacing: 20) {
                Picker("Type", selection: $selectedType) {
                    Text(TransactionType.expense.displayName).tag(TransactionType.expense)
                    Text(TransactionType.income.displayName).tag(TransactionType.income)
                }
                .pickerStyle(.segmented)
                .padding(.horizontal)

                if categories.isEmpty {
                    ContentUnavailableView(
                        "No \(selectedType.displayName) Data",
                        systemImage: "chart.pie",
                        description: Text("Nothing recorded for this month yet.")
                    )
                    .frame(height: 260)
                } else {
                    CategoryDonutChartView(categories: categories, total: total)
                        .frame(height: 260)
                        .padding(.horizontal)

                    VStack(spacing: 12) {
                        ForEach(categories) { category in
                            CategoryBreakdownRowView(category: category, total: total)
                        }
                    }
                    .padding(.horizontal)
                }

                Divider().padding(.horizontal)

                VStack(alignment: .leading, spacing: 12) {
                    Text("By Person")
                        .font(.headline)
                        .padding(.horizontal)

                    VStack(spacing: 12) {
                        ForEach(summary.byUser) { userAmount in
                            UserBreakdownRowView(userAmount: userAmount)
                        }
                    }
                    .padding(.horizontal)
                }
            }
            .padding(.vertical)
        }
        .refreshable {
            await viewModel.load()
        }
    }
}
