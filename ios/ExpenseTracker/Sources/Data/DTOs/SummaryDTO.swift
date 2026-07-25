import Foundation

/// Mirrors the backend's MonthlySummaryResponse schema. Amounts are Strings
/// for the same reason as TransactionResponseDTO: Pydantic serializes
/// Decimal as a JSON string, not a JSON number.
struct CategoryAmountDTO: Decodable {
    let categoryId: Int
    let categoryName: String
    let amount: String
}

extension CategoryAmountDTO {
    func toDomain() throws -> CategoryAmount {
        guard let amountValue = Decimal(string: amount) else {
            throw MappingError.invalidValue(field: "amount", value: amount)
        }
        return CategoryAmount(categoryId: categoryId, categoryName: categoryName, amount: amountValue)
    }
}

struct UserAmountDTO: Decodable {
    let userId: Int
    let userName: String
    let totalIncome: String
    let totalExpense: String
}

extension UserAmountDTO {
    func toDomain() throws -> UserAmount {
        guard let income = Decimal(string: totalIncome) else {
            throw MappingError.invalidValue(field: "totalIncome", value: totalIncome)
        }
        guard let expense = Decimal(string: totalExpense) else {
            throw MappingError.invalidValue(field: "totalExpense", value: totalExpense)
        }
        return UserAmount(userId: userId, userName: userName, totalIncome: income, totalExpense: expense)
    }
}

struct MonthlySummaryDTO: Decodable {
    let year: Int
    let month: Int
    let totalIncome: String
    let totalExpense: String
    let expensesByCategory: [CategoryAmountDTO]
    let incomeByCategory: [CategoryAmountDTO]
    let byUser: [UserAmountDTO]
}

extension MonthlySummaryDTO {
    func toDomain() throws -> MonthlySummary {
        guard let income = Decimal(string: totalIncome) else {
            throw MappingError.invalidValue(field: "totalIncome", value: totalIncome)
        }
        guard let expense = Decimal(string: totalExpense) else {
            throw MappingError.invalidValue(field: "totalExpense", value: totalExpense)
        }
        return MonthlySummary(
            year: year,
            month: month,
            totalIncome: income,
            totalExpense: expense,
            expensesByCategory: try expensesByCategory.map { try $0.toDomain() },
            incomeByCategory: try incomeByCategory.map { try $0.toDomain() },
            byUser: try byUser.map { try $0.toDomain() }
        )
    }
}
