import SwiftUI

/// Colored circle with a person's initial — the buildable stand-in for a
/// photo avatar, since there's no photo-upload feature. Color is derived
/// deterministically from the user's id so the same person always gets the
/// same color across the app. Mirrors the web app's InitialsAvatar.tsx.
struct InitialsAvatarView: View {
    let name: String
    let userId: Int
    var size: CGFloat = 40

    private static let palette: [Color] = [
        Color(hex: "0f172a"), Color(hex: "475569"), Color(hex: "0f766e"),
        Color(hex: "7c3aed"), Color(hex: "b45309"),
    ]

    var body: some View {
        Text(name.trimmingCharacters(in: .whitespaces).prefix(1).uppercased())
            .font(.system(size: size * 0.4, weight: .semibold))
            .foregroundStyle(.white)
            .frame(width: size, height: size)
            .background(Self.palette[userId % Self.palette.count])
            .clipShape(Circle())
    }
}
