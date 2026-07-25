import Foundation

@MainActor
final class SettingsViewModel: ObservableObject {
    @Published private(set) var users: [User] = []
    @Published private(set) var categories: [Category] = []
    @Published private(set) var isLoading = false
    @Published var errorMessage: String?

    private let userRepository: UserRepository
    private let categoryRepository: CategoryRepository

    init(userRepository: UserRepository, categoryRepository: CategoryRepository) {
        self.userRepository = userRepository
        self.categoryRepository = categoryRepository
    }

    func load() async {
        isLoading = true
        errorMessage = nil
        defer { isLoading = false }

        do {
            async let fetchedUsers = userRepository.fetchAll()
            async let fetchedCategories = categoryRepository.fetchAll()
            users = try await fetchedUsers
            categories = try await fetchedCategories
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    @discardableResult
    func renameUser(id: Int, newName: String) async -> Bool {
        errorMessage = nil
        do {
            let updated = try await userRepository.update(id: id, name: newName)
            if let index = users.firstIndex(where: { $0.id == id }) {
                users[index] = updated
            }
            return true
        } catch {
            errorMessage = error.localizedDescription
            return false
        }
    }

    @discardableResult
    func renameCategory(id: Int, newName: String) async -> Bool {
        errorMessage = nil
        do {
            let updated = try await categoryRepository.update(id: id, name: newName)
            if let index = categories.firstIndex(where: { $0.id == id }) {
                categories[index] = updated
            }
            return true
        } catch {
            errorMessage = error.localizedDescription
            return false
        }
    }

    /// Deletes the categories at the given offsets (from a List's .onDelete).
    /// IDs are resolved up front since `offsets` would go stale as items are removed.
    func deleteCategories(at offsets: IndexSet) {
        let idsToDelete = offsets.map { categories[$0].id }
        Task {
            for id in idsToDelete {
                await deleteCategory(id: id)
            }
        }
    }

    @discardableResult
    private func deleteCategory(id: Int) async -> Bool {
        do {
            try await categoryRepository.delete(id)
            categories.removeAll { $0.id == id }
            return true
        } catch {
            errorMessage = error.localizedDescription
            return false
        }
    }
}
