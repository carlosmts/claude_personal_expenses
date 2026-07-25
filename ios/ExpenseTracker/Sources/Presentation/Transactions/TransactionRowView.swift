import SwiftUI

struct TransactionRowView: View {
    let transaction: Transaction

    private static let dateFormatter: DateFormatter = {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        return formatter
    }()

    private static let amountFormatter: NumberFormatter = {
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.currencyCode = "EUR"
        return formatter
    }()

    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text(transaction.categoryName)
                    .font(.headline)
                if let description = transaction.description, !description.isEmpty {
                    Text(description)
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                }
                Text("\(transaction.userName) · \(Self.dateFormatter.string(from: transaction.date))")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }

            Spacer()

            Text(formattedAmount)
                .font(.headline)
                .foregroundStyle(transaction.type == .expense ? .red : .green)
        }
        .padding(.vertical, 4)
    }

    private var formattedAmount: String {
        let signedAmount = transaction.type == .expense ? -transaction.amount : transaction.amount
        let number = NSDecimalNumber(decimal: signedAmount)
        return Self.amountFormatter.string(from: number) ?? "\(signedAmount) €"
    }
}
