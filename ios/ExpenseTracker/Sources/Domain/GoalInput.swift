import Foundation

struct GoalInput {
    /// nil means a shared/household goal, not owned by one person.
    let userId: Int?
    let name: String
    let targetAmount: Decimal
    let currentAmount: Decimal
}
