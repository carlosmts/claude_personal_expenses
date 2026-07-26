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

/// Design tokens mirroring the web app's slate/steel-blue palette — see
/// web/src/lib/categoryStyle.ts and the Tailwind classes in web/src/components
/// for the source values this is kept in sync with.
enum Theme {
    /// Sidebar / primary-button color on web (`bg-slate-700`) — constant across
    /// light/dark since the web app doesn't vary it either.
    static let brandPrimary = Color(hex: "334155")

    static let income = Color(light: "16a34a", dark: "4ade80")   // green-600 / green-400
    static let expense = Color(light: "dc2626", dark: "f87171")  // red-600 / red-400

    /// Matches the web app's `rounded-2xl` (1rem) card corner radius.
    static let cardCornerRadius: CGFloat = 16

    /// Matches the web app's `text-3xl font-bold` big-stat numbers.
    static let statFont = Font.system(size: 30, weight: .bold)
}
