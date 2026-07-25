import Foundation

struct Goal: Identifiable, Equatable {
    /// nil means a shared/household goal, not owned by one person.
    let id: Int
    let userId: Int?
    let userName: String
    let name: String
    let targetAmount: Decimal
    let currentAmount: Decimal
}
