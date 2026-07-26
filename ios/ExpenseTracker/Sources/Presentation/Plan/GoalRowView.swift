import SwiftUI

struct GoalRowView: View {
    let goal: Goal

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Image(systemName: "target")
                    .foregroundStyle(.white)
                    .frame(width: 40, height: 40)
                    .background(Theme.brandPrimary)
                    .clipShape(Circle())

                VStack(alignment: .leading, spacing: 2) {
                    Text(goal.name)
                        .font(.subheadline.bold())
                    Text(goal.userName)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }

                Spacer()

                VStack(alignment: .trailing, spacing: 2) {
                    Text(CurrencyFormatter.string(from: goal.currentAmount))
                        .font(.subheadline.bold())
                    Text("of \(CurrencyFormatter.string(from: goal.targetAmount))")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
            }

            ProgressView(value: progress)
                .tint(Theme.brandPrimary)

            Text("\(Int((progress * 100).rounded()))% funded")
                .font(.caption)
                .foregroundStyle(.secondary)
        }
        .padding(12)
        .background(Color(.secondarySystemGroupedBackground))
        .clipShape(RoundedRectangle(cornerRadius: Theme.cardCornerRadius))
    }

    private var progress: Double {
        guard goal.targetAmount > 0 else { return 0 }
        let value = NSDecimalNumber(decimal: goal.currentAmount).doubleValue
            / NSDecimalNumber(decimal: goal.targetAmount).doubleValue
        return min(max(value, 0), 1)
    }
}
