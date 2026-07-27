/// Maps a category name to a display icon, mirroring the web app's
/// categoryStyle.ts icon lookup. Falls back to a neutral icon for anything
/// not in this curated list — categories are freeform (get-or-create by
/// name), so this can never be exhaustive. Color is intentionally not part
/// of this anymore: category tiles/charts are shaded by rank
/// (`Theme.rankShade`), not by identity.
enum CategoryStyle {
    private static let icons: [String: String] = [
        "groceries": "cart.fill",
        "food": "fork.knife",
        "restaurants": "fork.knife",
        "coffee": "cup.and.saucer.fill",
        "salary": "banknote.fill",
        "rent": "house.fill",
        "housing": "house.fill",
        "utilities": "bolt.fill",
        "transport": "car.fill",
        "car": "car.fill",
        "health": "heart.fill",
        "entertainment": "film.fill",
        "shopping": "bag.fill",
        "clothing": "tshirt.fill",
        "travel": "airplane",
        "education": "graduationcap.fill",
    ]

    private static let fallbackIcon = "tag.fill"

    static func icon(for categoryName: String) -> String {
        icons[categoryName.lowercased()] ?? fallbackIcon
    }
}
