import SwiftUI

extension View {
    /// Standard "Something went wrong" alert, shown whenever `message` is
    /// non-nil and dismissed (clearing `message`) on "OK".
    func errorAlert(_ message: Binding<String?>) -> some View {
        alert(
            "Something went wrong",
            isPresented: Binding(
                get: { message.wrappedValue != nil },
                set: { isPresented in
                    if !isPresented { message.wrappedValue = nil }
                }
            ),
            actions: {
                Button("OK") { message.wrappedValue = nil }
            },
            message: {
                Text(message.wrappedValue ?? "")
            }
        )
    }
}
