import SwiftUI

struct CategoryBreakdownRowView: View {
    let category: CategoryAmount
    let total: Decimal

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                CategoryIconView(categoryName: category.categoryName)

                VStack(alignment: .leading, spacing: 2) {
                    Text(category.categoryName)
                        .font(.subheadline.bold())
                    Text("\(Int((percentage * 100).rounded()))% of total")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }

                Spacer()

                Text(CurrencyFormatter.string(from: category.amount))
                    .font(.subheadline.bold())
            }

            ProgressView(value: percentage)
                .tint(CategoryStyle.color(for: category.categoryName))
        }
        .padding(12)
        .background(Color(.secondarySystemGroupedBackground))
        .clipShape(RoundedRectangle(cornerRadius: Theme.cardCornerRadius))
    }

    private var percentage: Double {
        guard total > 0 else { return 0 }
        return NSDecimalNumber(decimal: category.amount).doubleValue
            / NSDecimalNumber(decimal: total).doubleValue
    }
}
