import SwiftUI

/// Always-dark hero card (matches the Finbond reference — the balance card
/// stays navy regardless of the app's light/dark appearance setting) with an
/// embedded monthly mini bar chart, mirroring the web Dashboard's hero card.
struct BalanceCardView: View {
    let balance: Decimal
    var growthVsLastMonth: Double? = nil
    var growthVsLastYear: Double? = nil
    var monthlyBreakdown: [MonthBreakdown] = []

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text("Current Balance")
                .font(.subheadline)
                .foregroundStyle(.white.opacity(0.6))

            Text(CurrencyFormatter.string(from: balance))
                .font(Theme.statFont)
                .foregroundStyle(.white)

            HStack(spacing: 16) {
                GrowthBadgeView(label: "vs last month", percent: growthVsLastMonth, positiveIsGood: true, onDark: true)
                GrowthBadgeView(label: "vs last year", percent: growthVsLastYear, positiveIsGood: true, onDark: true)
            }

            if !monthlyBreakdown.isEmpty {
                MiniMonthlyChartView(breakdown: monthlyBreakdown)
                    .frame(height: 56)
                    .padding(.top, 12)
            }
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Theme.brandPrimary)
        .clipShape(RoundedRectangle(cornerRadius: Theme.cardCornerRadius))
    }
}

private struct MiniMonthlyChartView: View {
    let breakdown: [MonthBreakdown]

    private static let monthLabels = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ]

    var body: some View {
        let totals = breakdown.map { NSDecimalNumber(decimal: $0.income + $0.expense).doubleValue }
        let maxTotal = max(totals.max() ?? 1, 1)
        let lastActiveIndex = totals.lastIndex { $0 > 0 } ?? 0

        HStack(alignment: .bottom, spacing: 6) {
            ForEach(Array(breakdown.enumerated()), id: \.element.id) { index, entry in
                VStack(spacing: 4) {
                    RoundedRectangle(cornerRadius: 2)
                        .fill(index == lastActiveIndex ? Color(hex: "93c5fd") : Color.white.opacity(0.25))
                        .frame(height: max((totals[index] / maxTotal) * 40, 4))
                    Text(Self.monthLabels[entry.month - 1])
                        .font(.system(size: 9))
                        .foregroundStyle(.white.opacity(0.4))
                }
                .frame(maxWidth: .infinity)
            }
        }
        .frame(maxHeight: .infinity, alignment: .bottom)
    }
}
