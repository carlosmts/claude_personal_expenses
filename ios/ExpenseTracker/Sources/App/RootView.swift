import SwiftUI

struct RootView: View {
    let dependencies: AppDependencies

    var body: some View {
        TabView {
            HomeView(viewModel: dependencies.makeTransactionsViewModel())
                .tabItem { Label("Home", systemImage: "house.fill") }

            ReportView(viewModel: dependencies.makeReportViewModel())
                .tabItem { Label("Report", systemImage: "chart.pie.fill") }

            ComingSoonView(title: "Plan", systemImage: "target")
                .tabItem { Label("Plan", systemImage: "target") }

            ComingSoonView(title: "Settings", systemImage: "gearshape.fill")
                .tabItem { Label("Settings", systemImage: "gearshape.fill") }
        }
    }
}
