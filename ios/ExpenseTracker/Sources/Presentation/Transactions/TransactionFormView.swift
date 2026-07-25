import SwiftUI

/// Shared form for both creating a new transaction and editing an existing
/// one — the only difference is which fields are prefilled and which
/// repository call `save()` makes.
struct TransactionFormView: View {
    @ObservedObject var viewModel: TransactionsViewModel
    @Environment(\.dismiss) private var dismiss

    /// Non-nil when editing an existing transaction; nil when creating a new one.
    private let editingTransaction: Transaction?

    @State private var date: Date
    @State private var type: TransactionType
    @State private var amountText: String
    @State private var categoryName: String
    @State private var description: String
    @State private var selectedUserId: Int?

    init(viewModel: TransactionsViewModel, editingTransaction: Transaction? = nil) {
        self.viewModel = viewModel
        self.editingTransaction = editingTransaction
        _date = State(initialValue: editingTransaction?.date ?? Date())
        _type = State(initialValue: editingTransaction?.type ?? .expense)
        _amountText = State(
            initialValue: editingTransaction.map { Self.formattedAmount($0.amount) } ?? ""
        )
        _categoryName = State(initialValue: editingTransaction?.categoryName ?? "")
        _description = State(initialValue: editingTransaction?.description ?? "")
        _selectedUserId = State(initialValue: editingTransaction?.userId)
    }

    var body: some View {
        NavigationStack {
            Form {
                Section {
                    Picker("Type", selection: $type) {
                        ForEach(TransactionType.allCases) { type in
                            Text(type.displayName).tag(type)
                        }
                    }
                    .pickerStyle(.segmented)

                    DatePicker("Date", selection: $date, displayedComponents: .date)

                    TextField("Amount (EUR)", text: $amountText)
                        .keyboardType(.decimalPad)
                }

                Section {
                    CategoryPickerField(text: $categoryName, existingCategories: viewModel.categories)
                    TextField("Description (optional)", text: $description)
                }

                Section("Who's entering this?") {
                    Picker("User", selection: $selectedUserId) {
                        ForEach(viewModel.users) { user in
                            Text(user.name).tag(Optional(user.id))
                        }
                    }
                    .pickerStyle(.segmented)
                }
            }
            .navigationTitle(editingTransaction == nil ? "Add Transaction" : "Edit Transaction")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        Task { await save() }
                    }
                    .disabled(!isValid || viewModel.isSubmitting)
                }
            }
            .task {
                await viewModel.loadFormData()
            }
        }
    }

    /// Parses the amount using the device's locale, since the decimal keypad
    /// shows a comma (not a period) as the separator on many locales — e.g.
    /// Portuguese — and Decimal(string:) alone only understands periods.
    private var parsedAmount: Decimal? {
        Decimal(string: amountText, locale: .current)
    }

    private var isValid: Bool {
        guard let amount = parsedAmount, amount > 0 else { return false }
        guard !categoryName.trimmingCharacters(in: .whitespaces).isEmpty else { return false }
        return selectedUserId != nil
    }

    private func save() async {
        guard let amount = parsedAmount, let userId = selectedUserId else { return }

        let input = NewTransactionInput(
            date: date,
            type: type,
            amount: amount,
            categoryName: categoryName.trimmingCharacters(in: .whitespaces),
            userId: userId,
            description: description.isEmpty ? nil : description
        )

        let success: Bool
        if let editingTransaction {
            success = await viewModel.updateTransaction(id: editingTransaction.id, input: input)
        } else {
            success = await viewModel.addTransaction(input)
        }

        if success {
            dismiss()
        }
    }

    private static func formattedAmount(_ amount: Decimal) -> String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .decimal
        formatter.locale = .current
        formatter.minimumFractionDigits = 2
        formatter.maximumFractionDigits = 2
        return formatter.string(from: NSDecimalNumber(decimal: amount)) ?? "\(amount)"
    }
}
