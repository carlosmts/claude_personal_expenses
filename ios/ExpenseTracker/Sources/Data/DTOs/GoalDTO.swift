import Foundation

/// Mirrors the backend's GoalResponse schema. Amounts are Strings for the
/// same reason as TransactionResponseDTO: Pydantic serializes Decimal as a
/// JSON string, not a JSON number.
struct GoalResponseDTO: Decodable {
    let id: Int
    let userId: Int?
    let userName: String
    let name: String
    let targetAmount: String
    let currentAmount: String
}

extension GoalResponseDTO {
    func toDomain() throws -> Goal {
        guard let target = Decimal(string: targetAmount) else {
            throw MappingError.invalidValue(field: "targetAmount", value: targetAmount)
        }
        guard let current = Decimal(string: currentAmount) else {
            throw MappingError.invalidValue(field: "currentAmount", value: currentAmount)
        }
        return Goal(
            id: id,
            userId: userId,
            userName: userName,
            name: name,
            targetAmount: target,
            currentAmount: current
        )
    }
}

struct GoalRequestDTO: Encodable {
    let userId: Int?
    let name: String
    let targetAmount: String
    let currentAmount: String
}

extension GoalInput {
    func toDTO() -> GoalRequestDTO {
        GoalRequestDTO(
            userId: userId,
            name: name,
            targetAmount: "\(targetAmount)",
            currentAmount: "\(currentAmount)"
        )
    }
}
