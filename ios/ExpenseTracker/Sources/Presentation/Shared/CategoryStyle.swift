import SwiftUI

/// Maps a category name to a display icon + color for quick visual scanning
/// in lists and charts. Falls back to a neutral style for anything not in
/// this curated list — categories are freeform (get-or-create by name), so
/// this can never be exhaustive.
enum CategoryStyle {
    private static let styles: [String: (icon: String, color: Color)] = [
        "groceries": ("cart.fill", .green),
        "food": ("fork.knife", .orange),
        "restaurants": ("fork.knife", .orange),
        "coffee": ("cup.and.saucer.fill", .brown),
        "salary": ("banknote.fill", .mint),
        "rent": ("house.fill", .indigo),
        "housing": ("house.fill", .indigo),
        "utilities": ("bolt.fill", .yellow),
        "transport": ("car.fill", .blue),
        "car": ("car.fill", .blue),
        "health": ("heart.fill", .red),
        "entertainment": ("film.fill", .purple),
        "shopping": ("bag.fill", .pink),
        "clothing": ("tshirt.fill", .pink),
        "travel": ("airplane", .cyan),
        "education": ("graduationcap.fill", .teal),
    ]

    private static let fallback = (icon: "tag.fill", color: Color.gray)

    static func icon(for categoryName: String) -> String {
        styles[categoryName.lowercased()]?.icon ?? fallback.icon
    }

    static func color(for categoryName: String) -> Color {
        styles[categoryName.lowercased()]?.color ?? fallback.color
    }
}
