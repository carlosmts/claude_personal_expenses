import Foundation

@MainActor
final class LoginViewModel: ObservableObject {
    @Published var username = ""
    @Published var password = ""
    @Published var errorMessage: String?
    @Published private(set) var isSubmitting = false

    private let userRepository: UserRepository
    private let authState: AuthState

    init(userRepository: UserRepository, authState: AuthState) {
        self.userRepository = userRepository
        self.authState = authState
    }

    /// Attempts a lightweight authenticated request with the entered
    /// credentials. If this username has no password set yet, the backend
    /// claims it on this very request — there's no separate registration step.
    func signIn() async {
        errorMessage = nil
        isSubmitting = true
        defer { isSubmitting = false }

        CredentialsStore.save(Credentials(username: username, password: password))
        do {
            _ = try await userRepository.fetchAll()
            authState.isAuthenticated = true
        } catch {
            CredentialsStore.clear()
            if case let APIError.server(statusCode, _) = error, statusCode == 401 {
                errorMessage = "Incorrect username or password."
            } else {
                errorMessage = "Couldn't reach the server. Please try again."
            }
        }
    }
}
