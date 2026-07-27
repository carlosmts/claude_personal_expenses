import Charts
import SwiftUI

struct CategoryDonutChartView: View {
    let categories: [CategoryAmount]
    let total: Decimal

    var body: some View {
        Chart(Array(categories.enumerated()), id: \.element.id) { index, category in
            SectorMark(
                angle: .value("Amount", NSDecimalNumber(decimal: category.amount).doubleValue),
                innerRadius: .ratio(0.6),
                angularInset: 1.5
            )
            .foregroundStyle(Theme.rankShade(index))
            .cornerRadius(4)
        }
        .chartLegend(.hidden)
        .chartBackground { _ in
            VStack(spacing: 4) {
                Text("Total")
                    .font(.caption)
                    .foregroundStyle(.secondary)
                Text(CurrencyFormatter.string(from: total))
                    .font(.title2.bold())
            }
        }
    }
}
