import SwiftUI

struct TransactionRowView: View {
    let transaction: Transaction

    private static let dateFormatter: DateFormatter = {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        return formatter
    }()

    var body: some View {
        HStack(spacing: 12) {
            CategoryIconView(categoryName: transaction.categoryName)

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
        return CurrencyFormatter.string(from: signedAmount)
    }
}
