import SwiftUI

/// Shared form for both creating a new goal and editing an existing one —
/// mirrors TransactionFormView's add/edit pattern.
struct GoalFormView: View {
    @ObservedObject var viewModel: PlanViewModel
    @Environment(\.dismiss) private var dismiss

    private let editingGoal: Goal?

    @State private var name: String
    @State private var targetAmountText: String
    @State private var currentAmountText: String
    @State private var selectedUserId: Int?

    init(viewModel: PlanViewModel, editingGoal: Goal? = nil) {
        self.viewModel = viewModel
        self.editingGoal = editingGoal
        _name = State(initialValue: editingGoal?.name ?? "")
        _targetAmountText = State(
            initialValue: editingGoal.map { Self.formattedAmount($0.targetAmount) } ?? ""
        )
        _currentAmountText = State(
            initialValue: editingGoal.map { Self.formattedAmount($0.currentAmount) } ?? "0"
        )
        _selectedUserId = State(initialValue: editingGoal?.userId)
    }

    var body: some View {
        NavigationStack {
            Form {
                Section {
                    TextField("Goal Name", text: $name)
                    TextField("Target Amount (EUR)", text: $targetAmountText)
                        .keyboardType(.decimalPad)
                    TextField("Current Progress (EUR)", text: $currentAmountText)
                        .keyboardType(.decimalPad)
                }

                Section("Whose goal is this?") {
                    Picker("Person", selection: $selectedUserId) {
                        ForEach(viewModel.users) { user in
                            Text(user.name).tag(Optional(user.id))
                        }
                    }
                    .pickerStyle(.segmented)
                }
            }
            .navigationTitle(editingGoal == nil ? "New Goal" : "Edit Goal")
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
        }
    }

    private var parsedTarget: Decimal? {
        Decimal(string: targetAmountText, locale: .current)
    }

    private var parsedCurrent: Decimal? {
        currentAmountText.isEmpty ? Decimal(0) : Decimal(string: currentAmountText, locale: .current)
    }

    private var isValid: Bool {
        guard !name.trimmingCharacters(in: .whitespaces).isEmpty else { return false }
        guard let target = parsedTarget, target > 0 else { return false }
        guard let current = parsedCurrent, current >= 0 else { return false }
        return selectedUserId != nil
    }

    private func save() async {
        guard let target = parsedTarget, let current = parsedCurrent, let userId = selectedUserId else {
            return
        }

        let input = GoalInput(
            userId: userId,
            name: name.trimmingCharacters(in: .whitespaces),
            targetAmount: target,
            currentAmount: current
        )

        let success: Bool
        if let editingGoal {
            success = await viewModel.updateGoal(id: editingGoal.id, input: input)
        } else {
            success = await viewModel.addGoal(input)
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
