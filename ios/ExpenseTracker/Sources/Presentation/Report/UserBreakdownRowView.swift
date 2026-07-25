import SwiftUI

struct UserBreakdownRowView: View {
    let userAmount: UserAmount

    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text(userAmount.userName)
                    .font(.subheadline.bold())
                Text(
                    "Income \(CurrencyFormatter.string(from: userAmount.totalIncome)) · " +
                        "Expenses \(CurrencyFormatter.string(from: userAmount.totalExpense))"
                )
                .font(.caption)
                .foregroundStyle(.secondary)
            }

            Spacer()

            Text(CurrencyFormatter.string(from: netAmount))
                .font(.subheadline.bold())
                .foregroundStyle(netAmount >= 0 ? .green : .red)
        }
        .padding(12)
        .background(Color(.secondarySystemGroupedBackground))
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }

    private var netAmount: Decimal {
        userAmount.totalIncome - userAmount.totalExpense
    }
}
