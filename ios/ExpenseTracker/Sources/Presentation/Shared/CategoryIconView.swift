import SwiftUI

struct CategoryIconView: View {
    let categoryName: String
    var shape: Shape = .circle

    enum Shape {
        case circle
        case square
    }

    var body: some View {
        Image(systemName: CategoryStyle.icon(for: categoryName))
            .foregroundStyle(.primary)
            .frame(width: 40, height: 40)
            .background(Color(.systemGray5))
            .clipShape(shape == .circle ? AnyShape(Circle()) : AnyShape(RoundedRectangle(cornerRadius: 12)))
    }
}
