import Foundation

struct MonthlySummary: Equatable {
    let year: Int
    let month: Int
    let totalIncome: Decimal
    let totalExpense: Decimal
    let expensesByCategory: [CategoryAmount]
    let incomeByCategory: [CategoryAmount]
    let byUser: [UserAmount]
}
