import Foundation

struct CategoryAmount: Identifiable, Equatable {
    let categoryId: Int
    let categoryName: String
    let amount: Decimal

    var id: Int { categoryId }
}
