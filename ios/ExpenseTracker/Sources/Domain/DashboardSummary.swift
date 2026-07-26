import Foundation

struct DashboardSummary: Equatable {
    let year: Int
    let allTimeIncome: Decimal
    let allTimeExpense: Decimal
    let currentMonthIncome: Decimal
    let currentMonthExpense: Decimal
    let previousMonthIncome: Decimal
    let previousMonthExpense: Decimal
    let previousYearMonthIncome: Decimal
    let previousYearMonthExpense: Decimal
    let monthlyBreakdown: [MonthBreakdown]
}
