import Foundation

/// Mirrors the backend's TransactionCreateRequest schema.
///
/// `amount` is a String for the same reason as TransactionResponseDTO: it
/// keeps the wire format explicit rather than relying on JSONEncoder's
/// numeric encoding, which doesn't match how Pydantic parses Decimal input.
struct TransactionCreateRequestDTO: Encodable {
    let date: Date
    let type: String
    let amount: String
    let categoryName: String
    let userId: Int
    let description: String?
}

extension NewTransactionInput {
    func toDTO() -> TransactionCreateRequestDTO {
        TransactionCreateRequestDTO(
            date: date,
            type: type.rawValue,
            amount: "\(amount)",
            categoryName: categoryName,
            userId: userId,
            description: description
        )
    }
}
