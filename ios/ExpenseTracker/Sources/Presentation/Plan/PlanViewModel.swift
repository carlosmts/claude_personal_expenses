import Foundation

@MainActor
final class PlanViewModel: ObservableObject {
    @Published private(set) var goals: [Goal] = []
    @Published private(set) var users: [User] = []
    @Published private(set) var isLoading = false
    @Published private(set) var isSubmitting = false
    @Published var errorMessage: String?

    private let goalRepository: GoalRepository
    private let userRepository: UserRepository

    init(goalRepository: GoalRepository, userRepository: UserRepository) {
        self.goalRepository = goalRepository
        self.userRepository = userRepository
    }

    func load() async {
        isLoading = true
        errorMessage = nil
        defer { isLoading = false }

        do {
            async let fetchedGoals = goalRepository.fetchAll()
            async let fetchedUsers = userRepository.fetchAll()
            goals = try await fetchedGoals
            users = try await fetchedUsers
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    @discardableResult
    func addGoal(_ input: GoalInput) async -> Bool {
        isSubmitting = true
        errorMessage = nil
        defer { isSubmitting = false }

        do {
            let created = try await goalRepository.create(input)
            goals.append(created)
            return true
        } catch {
            errorMessage = error.localizedDescription
            return false
        }
    }

    @discardableResult
    func updateGoal(id: Int, input: GoalInput) async -> Bool {
        isSubmitting = true
        errorMessage = nil
        defer { isSubmitting = false }

        do {
            let updated = try await goalRepository.update(id: id, input: input)
            if let index = goals.firstIndex(where: { $0.id == id }) {
                goals[index] = updated
            }
            return true
        } catch {
            errorMessage = error.localizedDescription
            return false
        }
    }

    /// Deletes the goals at the given offsets (from a List's .onDelete).
    /// IDs are resolved up front since `offsets` would go stale as items are removed.
    func deleteGoals(at offsets: IndexSet) {
        let idsToDelete = offsets.map { goals[$0].id }
        Task {
            for id in idsToDelete {
                await deleteGoal(id: id)
            }
        }
    }

    @discardableResult
    private func deleteGoal(id: Int) async -> Bool {
        do {
            try await goalRepository.delete(id)
            goals.removeAll { $0.id == id }
            return true
        } catch {
            errorMessage = error.localizedDescription
            return false
        }
    }
}
