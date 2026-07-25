import SwiftUI

/// Placeholder for tabs whose real screen hasn't been built yet.
struct ComingSoonView: View {
    let title: String
    let systemImage: String

    var body: some View {
        NavigationStack {
            ContentUnavailableView(
                "\(title) — Coming Soon",
                systemImage: systemImage,
                description: Text("This screen is being built in an upcoming step.")
            )
            .navigationTitle(title)
        }
    }
}
