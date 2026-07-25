import SwiftUI

struct CategoryIconView: View {
    let categoryName: String

    var body: some View {
        Image(systemName: CategoryStyle.icon(for: categoryName))
            .foregroundStyle(.white)
            .frame(width: 40, height: 40)
            .background(CategoryStyle.color(for: categoryName))
            .clipShape(Circle())
    }
}
