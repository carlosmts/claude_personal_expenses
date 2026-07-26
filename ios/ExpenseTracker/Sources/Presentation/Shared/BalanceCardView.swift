import SwiftUI

struct BalanceCardView: View {
    let balance: Decimal

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text("Current Balance")
                .font(.subheadline)
                .foregroundStyle(.secondary)

            Text(CurrencyFormatter.string(from: balance))
                .font(Theme.statFont)
                .foregroundStyle(.primary)
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(.secondarySystemGroupedBackground))
        .clipShape(RoundedRectangle(cornerRadius: Theme.cardCornerRadius))
    }
}
