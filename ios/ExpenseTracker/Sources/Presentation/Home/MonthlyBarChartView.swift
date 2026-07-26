import Charts
import SwiftUI

/// Swift Charts port of the web app's monthly income/expense bar chart —
/// grouped bars per month, colored to match `Theme.income`/`Theme.expense`.
struct MonthlyBarChartView: View {
    let breakdown: [MonthBreakdown]

    private static let monthLabels = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ]

    var body: some View {
        Chart {
            ForEach(breakdown) { entry in
                BarMark(
                    x: .value("Month", Self.monthLabels[entry.month - 1]),
                    y: .value("Amount", NSDecimalNumber(decimal: entry.income).doubleValue)
                )
                .position(by: .value("Type", "Income"))
                .foregroundStyle(by: .value("Type", "Income"))

                BarMark(
                    x: .value("Month", Self.monthLabels[entry.month - 1]),
                    y: .value("Amount", NSDecimalNumber(decimal: entry.expense).doubleValue)
                )
                .position(by: .value("Type", "Expense"))
                .foregroundStyle(by: .value("Type", "Expense"))
            }
        }
        .chartForegroundStyleScale([
            "Income": Theme.income,
            "Expense": Theme.expense,
        ])
        .chartLegend(position: .bottom)
    }
}
