import Foundation

@MainActor
final class DashboardViewModel: ObservableObject {
    @Published private(set) var summary: DashboardSummary?
    @Published private(set) var users: [User] = []
    @Published private(set) var isLoading = false
    @Published var errorMessage: String?

    /// nil means "All" — no person filter applied.
    @Published var selectedUserId: Int? {
        didSet {
            guard oldValue != selectedUserId else { return }
            Task { await loadSummary() }
        }
    }

    private let dashboardRepository: DashboardRepository
    private let userRepository: UserRepository

    init(dashboardRepository: DashboardRepository, userRepository: UserRepository) {
        self.dashboardRepository = dashboardRepository
        self.userRepository = userRepository
    }

    func load() async {
        async let summaryTask: Void = loadSummary()
        async let usersTask: Void = loadUsers()
        _ = await (summaryTask, usersTask)
    }

    func loadSummary() async {
        isLoading = true
        errorMessage = nil
        defer { isLoading = false }

        do {
            let year = Calendar.current.component(.year, from: Date())
            summary = try await dashboardRepository.fetchDashboard(year: year, userId: selectedUserId)
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    private func loadUsers() async {
        do {
            users = try await userRepository.fetchAll()
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}
