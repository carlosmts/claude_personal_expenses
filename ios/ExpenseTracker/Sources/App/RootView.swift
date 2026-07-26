import SwiftUI

struct RootView: View {
    let dependencies: AppDependencies

    @AppStorage("appearancePreference") private var appearanceRawValue = AppearancePreference.system.rawValue

    var body: some View {
        TabView {
            HomeView(
                viewModel: dependencies.makeTransactionsViewModel(),
                dashboardViewModel: dependencies.makeDashboardViewModel()
            )
            .tabItem { Label("Dashboard", systemImage: "house.fill") }

            ReportView(viewModel: dependencies.makeReportViewModel())
                .tabItem { Label("Report", systemImage: "chart.pie.fill") }

            PlanView(viewModel: dependencies.makePlanViewModel())
                .tabItem { Label("Plan", systemImage: "target") }

            SettingsView(viewModel: dependencies.makeSettingsViewModel())
                .tabItem { Label("Settings", systemImage: "gearshape.fill") }
        }
        .tint(Theme.brandPrimary)
        .preferredColorScheme(
            (AppearancePreference(rawValue: appearanceRawValue) ?? .system).colorScheme
        )
    }
}
