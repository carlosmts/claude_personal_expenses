import SwiftUI

@main
struct ExpenseTrackerApp: App {
    private let dependencies = AppDependencies()
    @StateObject private var authState = AuthState()

    var body: some Scene {
        WindowGroup {
            RootView(dependencies: dependencies)
                .environmentObject(authState)
        }
    }
}
