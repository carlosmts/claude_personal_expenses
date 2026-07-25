import SwiftUI

struct BalanceCardView: View {
    let balance: Decimal

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Current Balance")
                .font(.subheadline)
                .foregroundStyle(.white.opacity(0.85))

            Text(CurrencyFormatter.string(from: balance))
                .font(.system(size: 34, weight: .bold))
                .foregroundStyle(.white)
        }
        .padding(24)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(
            LinearGradient(
                colors: [
                    Color(red: 0.42, green: 0.36, blue: 0.91),
                    Color(red: 0.29, green: 0.22, blue: 0.78),
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        )
        .clipShape(RoundedRectangle(cornerRadius: 24))
    }
}
