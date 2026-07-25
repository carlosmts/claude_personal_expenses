import SwiftUI

struct AddTransactionView: View {
    @ObservedObject var viewModel: TransactionsViewModel
    @Environment(\.dismiss) private var dismiss

    @State private var date = Date()
    @State private var type: TransactionType = .expense
    @State private var amountText = ""
    @State private var categoryName = ""
    @State private var description = ""
    @State private var selectedUserId: Int?

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
            .navigationTitle("Add Transaction")
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

        if await viewModel.addTransaction(input) {
            dismiss()
        }
    }
}
