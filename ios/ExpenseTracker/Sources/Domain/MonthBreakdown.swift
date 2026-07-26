import Foundation

struct MonthBreakdown: Identifiable, Equatable {
    let month: Int
    let income: Decimal
    let expense: Decimal

    var id: Int { month }
}
