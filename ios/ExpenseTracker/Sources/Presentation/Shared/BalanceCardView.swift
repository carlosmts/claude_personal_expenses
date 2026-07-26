import SwiftUI

struct BalanceCardView: View {
    let balance: Decimal
    var growthVsLastMonth: Double? = nil

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text("Current Balance")
                .font(.subheadline)
                .foregroundStyle(.secondary)

            Text(CurrencyFormatter.string(from: balance))
                .font(Theme.statFont)
                .foregroundStyle(.primary)

            GrowthBadgeView(label: "vs last month", percent: growthVsLastMonth, positiveIsGood: true)
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
        .cardStyle()
    }
}
