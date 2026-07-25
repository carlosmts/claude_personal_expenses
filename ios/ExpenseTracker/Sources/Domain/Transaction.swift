import Foundation

struct Transaction: Identifiable, Equatable {
    let id: Int
    let date: Date
    let type: TransactionType
    let amount: Decimal
    let description: String?
    let categoryId: Int
    let categoryName: String
    let userId: Int
    let userName: String
}
