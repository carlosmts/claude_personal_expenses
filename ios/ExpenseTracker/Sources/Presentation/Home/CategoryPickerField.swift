import SwiftUI

/// A text field for entering a category name, with tap-to-fill suggestions
/// from existing categories. Typing any name not in the list is fine — the
/// backend creates it on save (get-or-create by name).
struct CategoryPickerField: View {
    @Binding var text: String
    let existingCategories: [Category]

    private var suggestions: [Category] {
        guard !text.isEmpty else { return [] }
        return existingCategories.filter { $0.name.localizedCaseInsensitiveContains(text) }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            TextField("Category", text: $text)
                .textInputAutocapitalization(.words)

            if !suggestions.isEmpty {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack {
                        ForEach(suggestions) { category in
                            Button(category.name) { text = category.name }
                                .buttonStyle(.bordered)
                                .font(.caption)
                        }
                    }
                }
            }
        }
    }
}
