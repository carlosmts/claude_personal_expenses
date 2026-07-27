import SwiftUI

extension Color {
    /// Static color from a 6-digit hex string like "334155" (no leading #).
    init(hex: String) {
        var rgb: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&rgb)
        self.init(
            red: Double((rgb >> 16) & 0xFF) / 255,
            green: Double((rgb >> 8) & 0xFF) / 255,
            blue: Double(rgb & 0xFF) / 255
        )
    }

    /// Adaptive color that switches hex value between light and dark mode,
    /// mirroring the web app's `dark:` Tailwind variants.
    init(light: String, dark: String) {
        self.init(UIColor { traits in
            UIColor(Color(hex: traits.userInterfaceStyle == .dark ? dark : light))
        })
    }
}

/// Design tokens mirroring the Finbond web app's palette — see
/// web/src/lib/categoryStyle.ts, web/src/lib/rankShade.ts, and the Tailwind
/// classes in web/src/components for the source values this is kept in sync
/// with.
enum Theme {
    /// Sidebar / primary-button / hero-card color on web (`bg-slate-900`) —
    /// constant across light/dark since the web app doesn't vary it either.
    static let brandPrimary = Color(hex: "0f172a")

    static let income = Color(light: "16a34a", dark: "4ade80")   // green-600 / green-400

    /// Expense amounts and "bad" growth indicators are plain neutral text now
    /// (not red) — matches the reference mockups, which never use red
    /// anywhere. Uses the system label color so it stays perfectly adaptive.
    static let expense = Color(uiColor: .label)

    /// Greyscale ramp for shading chart slices/bars by sort position rather
    /// than by category/person identity — biggest is darkest, tapering to
    /// light grey. Mirrors web's rankShade.ts.
    private static let rankShades = [
        Color(hex: "0f172a"), Color(hex: "475569"), Color(hex: "94a3b8"),
        Color(hex: "cbd5e1"), Color(hex: "e2e8f0"),
    ]

    static func rankShade(_ index: Int) -> Color {
        rankShades[Swift.min(index, rankShades.count - 1)]
    }

    /// Matches the web app's `rounded-3xl` (1.5rem) card corner radius.
    static let cardCornerRadius: CGFloat = 20

    /// Matches the web app's `text-3xl font-bold` big-stat numbers.
    static let statFont = Font.system(size: 30, weight: .bold)

    /// Page background behind floating cards — matches the web's
    /// `bg-slate-50 dark:bg-gray-900` page background, distinct from the
    /// white/`secondarySystemGroupedBackground` card fill so cards actually
    /// read as elevated instead of blending into a plain white background.
    static let pageBackground = Color(light: "f8fafc", dark: "111827")

    /// "Panel" background for highlighted-but-not-a-card sections (By
    /// Person, Quick Action equivalents) — matches web's `bg-slate-100
    /// dark:bg-gray-800/60`, distinct from both the page and plain card fills.
    static let panelBackground = Color(light: "f1f5f9", dark: "1e293b")

    static let cardShadowColor = Color.black.opacity(0.06)
    static let cardShadowRadius: CGFloat = 6
    static let cardShadowY: CGFloat = 2
}

extension View {
    /// Standard card chrome — adaptive fill, rounded corners, subtle shadow.
    /// Mirrors the web's `rounded-2xl bg-white shadow-sm dark:bg-gray-800`.
    func cardStyle() -> some View {
        background(Color(.secondarySystemGroupedBackground))
            .clipShape(RoundedRectangle(cornerRadius: Theme.cardCornerRadius))
            .shadow(color: Theme.cardShadowColor, radius: Theme.cardShadowRadius, x: 0, y: Theme.cardShadowY)
    }
}
