import SwiftUI

struct StatTileView: View {
    let title: String
    let amount: Decimal
    let tintColor: Color
    var growthPercent: Double? = nil
    var positiveIsGood: Bool = true

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(title)
                .font(.subheadline)
                .foregroundStyle(.secondary)
            Text(CurrencyFormatter.string(from: amount))
                .font(Theme.statFont)
                .foregroundStyle(tintColor)
            GrowthBadgeView(label: "vs last month", percent: growthPercent, positiveIsGood: positiveIsGood)
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
        .cardStyle()
    }
}
