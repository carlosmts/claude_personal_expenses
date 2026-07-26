import Foundation

/// Mirrors the backend's DashboardSummaryResponse schema. Amounts are Strings
/// for the same reason as MonthlySummaryDTO: Pydantic serializes Decimal as a
/// JSON string, not a JSON number.
struct MonthBreakdownDTO: Decodable {
    let month: Int
    let income: String
    let expense: String
}

extension MonthBreakdownDTO {
    func toDomain() throws -> MonthBreakdown {
        guard let income = Decimal(string: income) else {
            throw MappingError.invalidValue(field: "income", value: income)
        }
        guard let expense = Decimal(string: expense) else {
            throw MappingError.invalidValue(field: "expense", value: expense)
        }
        return MonthBreakdown(month: month, income: income, expense: expense)
    }
}

struct DashboardSummaryDTO: Decodable {
    let year: Int
    let allTimeIncome: String
    let allTimeExpense: String
    let currentMonthIncome: String
    let currentMonthExpense: String
    let previousMonthIncome: String
    let previousMonthExpense: String
    let previousYearMonthIncome: String
    let previousYearMonthExpense: String
    let monthlyBreakdown: [MonthBreakdownDTO]
}

extension DashboardSummaryDTO {
    func toDomain() throws -> DashboardSummary {
        func decimal(_ field: String, _ value: String) throws -> Decimal {
            guard let parsed = Decimal(string: value) else {
                throw MappingError.invalidValue(field: field, value: value)
            }
            return parsed
        }

        return DashboardSummary(
            year: year,
            allTimeIncome: try decimal("allTimeIncome", allTimeIncome),
            allTimeExpense: try decimal("allTimeExpense", allTimeExpense),
            currentMonthIncome: try decimal("currentMonthIncome", currentMonthIncome),
            currentMonthExpense: try decimal("currentMonthExpense", currentMonthExpense),
            previousMonthIncome: try decimal("previousMonthIncome", previousMonthIncome),
            previousMonthExpense: try decimal("previousMonthExpense", previousMonthExpense),
            previousYearMonthIncome: try decimal("previousYearMonthIncome", previousYearMonthIncome),
            previousYearMonthExpense: try decimal("previousYearMonthExpense", previousYearMonthExpense),
            monthlyBreakdown: try monthlyBreakdown.map { try $0.toDomain() }
        )
    }
}
