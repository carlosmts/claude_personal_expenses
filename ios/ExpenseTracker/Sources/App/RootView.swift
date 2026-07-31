import SwiftUI

struct RootView: View {
    let dependencies: AppDependencies

    @EnvironmentObject private var authState: AuthState
    @AppStorage("appearancePreference") private var appearanceRawValue = AppearancePreference.system.rawValue

    var body: some View {
        Group {
            if authState.isAuthenticated {
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
            } else {
                LoginView(viewModel: dependencies.makeLoginViewModel(authState: authState))
            }
        }
        .tint(Theme.brandPrimary)
        .preferredColorScheme(
            (AppearancePreference(rawValue: appearanceRawValue) ?? .system).colorScheme
        )
    }
}
