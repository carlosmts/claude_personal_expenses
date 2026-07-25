import Foundation

struct UserAmount: Identifiable, Equatable {
    let userId: Int
    let userName: String
    let totalIncome: Decimal
    let totalExpense: Decimal

    var id: Int { userId }
}
