import Foundation

struct NewTransactionInput {
    let date: Date
    let type: TransactionType
    let amount: Decimal
    let categoryName: String
    let userId: Int
    let description: String?
}
