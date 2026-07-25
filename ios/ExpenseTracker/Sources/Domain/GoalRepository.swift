protocol GoalRepository {
    func fetchAll() async throws -> [Goal]
    func create(_ input: GoalInput) async throws -> Goal
    func update(id: Int, input: GoalInput) async throws -> Goal
    func delete(_ id: Int) async throws
}
