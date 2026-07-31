import Foundation

/// Whether the app currently has valid-looking stored credentials. Flips to
/// false the moment any API call comes back 401 (see APIClient.onUnauthorized),
/// dropping the whole app back to the login screen regardless of which tab
/// triggered it.
@MainActor
final class AuthState: ObservableObject {
    @Published var isAuthenticated: Bool

    init() {
        isAuthenticated = CredentialsStore.load() != nil
        APIClient.onUnauthorized = { [weak self] in
            Task { @MainActor in
                self?.isAuthenticated = false
            }
        }
    }

    func signOut() {
        CredentialsStore.clear()
        isAuthenticated = false
    }
}
