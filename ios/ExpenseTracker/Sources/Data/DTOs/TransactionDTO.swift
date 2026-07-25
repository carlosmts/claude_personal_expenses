import Foundation

/// Mirrors the backend's TransactionResponse schema.
///
/// `amount` is a String because FastAPI/Pydantic serializes `Decimal` fields
/// as JSON strings (to preserve precision) rather than JSON numbers.
struct TransactionResponseDTO: Decodable {
    let id: Int
    let date: Date
    let type: String
    let amount: String
    let description: String?
    let categoryId: Int
    let categoryName: String
    let userId: Int
    let userName: String
}

extension TransactionResponseDTO {
    func toDomain() throws -> Transaction {
        guard let type = TransactionType(rawValue: type) else {
            throw MappingError.invalidValue(field: "type", value: type)
        }
        guard let amountValue = Decimal(string: amount) else {
            throw MappingError.invalidValue(field: "amount", value: amount)
        }

        return Transaction(
            id: id,
            date: date,
            type: type,
            amount: amountValue,
            description: description,
            categoryId: categoryId,
            categoryName: categoryName,
            userId: userId,
            userName: userName
        )
    }
}
