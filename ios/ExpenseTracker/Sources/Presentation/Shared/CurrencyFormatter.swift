import Foundation

enum CurrencyFormatter {
    private static let formatter: NumberFormatter = {
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.currencyCode = "EUR"
        return formatter
    }()

    static func string(from amount: Decimal) -> String {
        formatter.string(from: NSDecimalNumber(decimal: amount)) ?? "\(amount) €"
    }
}
