import SwiftUI

/// Maps a category name to a display icon + color for quick visual scanning
/// in lists and charts. Falls back to a neutral style for anything not in
/// this curated list — categories are freeform (get-or-create by name), so
/// this can never be exhaustive.
enum CategoryStyle {
    private static let styles: [String: (icon: String, color: Color)] = [
        "groceries": ("cart.fill", Color(hex: "22c55e")),
        "food": ("fork.knife", Color(hex: "f97316")),
        "restaurants": ("fork.knife", Color(hex: "f97316")),
        "coffee": ("cup.and.saucer.fill", Color(hex: "a16207")),
        "salary": ("banknote.fill", Color(hex: "10b981")),
        "rent": ("house.fill", Color(hex: "6366f1")),
        "housing": ("house.fill", Color(hex: "6366f1")),
        "utilities": ("bolt.fill", Color(hex: "eab308")),
        "transport": ("car.fill", Color(hex: "3b82f6")),
        "car": ("car.fill", Color(hex: "3b82f6")),
        "health": ("heart.fill", Color(hex: "ef4444")),
        "entertainment": ("film.fill", Color(hex: "a855f7")),
        "shopping": ("bag.fill", Color(hex: "ec4899")),
        "clothing": ("tshirt.fill", Color(hex: "ec4899")),
        "travel": ("airplane", Color(hex: "06b6d4")),
        "education": ("graduationcap.fill", Color(hex: "14b8a6")),
    ]

    private static let fallback = (icon: "tag.fill", color: Color(hex: "6b7280"))

    static func icon(for categoryName: String) -> String {
        styles[categoryName.lowercased()]?.icon ?? fallback.icon
    }

    static func color(for categoryName: String) -> Color {
        styles[categoryName.lowercased()]?.color ?? fallback.color
    }
}
