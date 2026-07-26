import SwiftUI

struct StatTileView: View {
    let title: String
    let amount: Decimal
    let tintColor: Color

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(title)
                .font(.subheadline)
                .foregroundStyle(.secondary)
            Text(CurrencyFormatter.string(from: amount))
                .font(Theme.statFont)
                .foregroundStyle(tintColor)
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
        .cardStyle()
    }
}
