import Foundation

@MainActor
final class ReportViewModel: ObservableObject {
    @Published private(set) var summary: MonthlySummary?
    @Published private(set) var isLoading = false
    @Published var errorMessage: String?
    @Published private(set) var selectedYear: Int
    @Published private(set) var selectedMonth: Int

    private let summaryRepository: SummaryRepository

    init(summaryRepository: SummaryRepository) {
        self.summaryRepository = summaryRepository
        let now = Calendar.current.dateComponents([.year, .month], from: Date())
        selectedYear = now.year ?? 2026
        selectedMonth = now.month ?? 1
    }

    var monthTitle: String {
        var components = DateComponents()
        components.year = selectedYear
        components.month = selectedMonth
        components.day = 1
        guard let date = Calendar.current.date(from: components) else { return "" }

        let formatter = DateFormatter()
        formatter.dateFormat = "LLLL yyyy"
        return formatter.string(from: date).capitalized
    }

    func load() async {
        isLoading = true
        errorMessage = nil
        defer { isLoading = false }

        do {
            summary = try await summaryRepository.fetchSummary(year: selectedYear, month: selectedMonth)
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func goToPreviousMonth() {
        shiftMonth(by: -1)
    }

    func goToNextMonth() {
        shiftMonth(by: 1)
    }

    private func shiftMonth(by offset: Int) {
        var components = DateComponents()
        components.year = selectedYear
        components.month = selectedMonth
        components.day = 1

        guard let date = Calendar.current.date(from: components),
              let shifted = Calendar.current.date(byAdding: .month, value: offset, to: date) else {
            return
        }

        let shiftedComponents = Calendar.current.dateComponents([.year, .month], from: shifted)
        selectedYear = shiftedComponents.year ?? selectedYear
        selectedMonth = shiftedComponents.month ?? selectedMonth

        Task { await load() }
    }
}
