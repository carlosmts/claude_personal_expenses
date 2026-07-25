import Foundation

struct Goal: Identifiable, Equatable {
    let id: Int
    let userId: Int
    let userName: String
    let name: String
    let targetAmount: Decimal
    let currentAmount: Decimal
}
