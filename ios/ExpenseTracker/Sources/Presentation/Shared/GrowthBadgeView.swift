import SwiftUI

/// SwiftUI port of the web app's `GrowthBadge.tsx` — an up/down arrow +
/// colored capsule showing percent change, or a muted "New" label when
/// there's no meaningful previous value to compare against.
struct GrowthBadgeView: View {
    let label: String
    let percent: Double?
    /// Whether an increase (positive %) counts as good — true for income/net, false for expenses.
    let positiveIsGood: Bool

    var body: some View {
        if let percent {
            let isPositive = percent >= 0
            let isGood = isPositive == positiveIsGood
            let color = isGood ? Theme.income : Theme.expense

            HStack(spacing: 4) {
                Text("\(label):")
                    .font(.caption)
                    .foregroundStyle(.secondary)

                HStack(spacing: 2) {
                    Image(systemName: isPositive ? "arrow.up" : "arrow.down")
                        .font(.system(size: 9, weight: .semibold))
                    Text(String(format: "%.1f%%", abs(percent)))
                }
                .font(.caption.bold())
                .foregroundStyle(color)
                .padding(.horizontal, 6)
                .padding(.vertical, 2)
                .background(color.opacity(0.15))
                .clipShape(Capsule())
            }
        } else {
            HStack(spacing: 4) {
                Text("\(label):")
                    .font(.caption)
                    .foregroundStyle(.secondary)
                Text("New")
                    .font(.caption.bold())
                    .foregroundStyle(.secondary)
            }
        }
    }
}
