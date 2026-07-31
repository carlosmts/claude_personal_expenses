import SwiftUI

struct SettingsView: View {
    @StateObject private var viewModel: SettingsViewModel
    @EnvironmentObject private var authState: AuthState

    @AppStorage("appearancePreference") private var appearanceRawValue = AppearancePreference.system.rawValue
    @State private var baseURLText = APIConfiguration.baseURL.absoluteString
    @State private var baseURLErrorMessage: String?

    @State private var renamingUser: User?
    @State private var renamingCategory: Category?
    @State private var renameText = ""
    @State private var pendingDeleteOffsets: IndexSet?

    init(viewModel: SettingsViewModel) {
        _viewModel = StateObject(wrappedValue: viewModel)
    }

    var body: some View {
        NavigationStack {
            Form {
                Section("Appearance") {
                    Picker("Appearance", selection: $appearanceRawValue) {
                        ForEach(AppearancePreference.allCases) { preference in
                            Text(preference.displayName).tag(preference.rawValue)
                        }
                    }
                    .pickerStyle(.segmented)
                }

                Section {
                    TextField("http://192.168.1.x:8000", text: $baseURLText)
                        .keyboardType(.URL)
                        .textInputAutocapitalization(.never)
                        .autocorrectionDisabled()

                    if let baseURLErrorMessage {
                        Text(baseURLErrorMessage)
                            .font(.caption)
                            .foregroundStyle(.red)
                    }

                    Button("Save") { saveBaseURL() }
                    Button("Reset to Default", role: .destructive) { resetBaseURL() }
                } header: {
                    Text("Backend Server")
                } footer: {
                    Text("Your Mac's LAN IP changes sometimes (e.g. after a router reboot) — update it here instead of rebuilding the app.")
                }

                Section("People") {
                    ForEach(viewModel.users) { user in
                        Button {
                            renamingUser = user
                            renameText = user.name
                        } label: {
                            HStack {
                                Text(user.name)
                                    .foregroundStyle(.primary)
                                Spacer()
                                Image(systemName: "pencil")
                                    .foregroundStyle(.secondary)
                            }
                        }
                    }
                }

                Section {
                    ForEach(viewModel.categories) { category in
                        Button {
                            renamingCategory = category
                            renameText = category.name
                        } label: {
                            HStack {
                                CategoryIconView(categoryName: category.name)
                                Text(category.name)
                                    .foregroundStyle(.primary)
                                Spacer()
                                Image(systemName: "pencil")
                                    .foregroundStyle(.secondary)
                            }
                        }
                    }
                    .onDelete { offsets in
                        pendingDeleteOffsets = offsets
                    }
                } header: {
                    Text("Categories")
                } footer: {
                    Text("A category with existing transactions can't be deleted.")
                }

                Section("Account") {
                    Button("Log Out", role: .destructive) {
                        authState.signOut()
                    }
                }

                Section("About") {
                    LabeledContent("Version", value: appVersion)
                }
            }
            .navigationTitle("Settings")
            .alert(
                "Rename Person",
                isPresented: Binding(
                    get: { renamingUser != nil },
                    set: { if !$0 { renamingUser = nil } }
                ),
                presenting: renamingUser
            ) { user in
                TextField("Name", text: $renameText)
                Button("Save") {
                    Task {
                        await viewModel.renameUser(id: user.id, newName: renameText)
                        renamingUser = nil
                    }
                }
                Button("Cancel", role: .cancel) { renamingUser = nil }
            }
            .alert(
                "Rename Category",
                isPresented: Binding(
                    get: { renamingCategory != nil },
                    set: { if !$0 { renamingCategory = nil } }
                ),
                presenting: renamingCategory
            ) { category in
                TextField("Name", text: $renameText)
                Button("Save") {
                    Task {
                        await viewModel.renameCategory(id: category.id, newName: renameText)
                        renamingCategory = nil
                    }
                }
                Button("Cancel", role: .cancel) { renamingCategory = nil }
            }
            .alert(
                "Delete Category?",
                isPresented: Binding(
                    get: { pendingDeleteOffsets != nil },
                    set: { isPresented in
                        if !isPresented { pendingDeleteOffsets = nil }
                    }
                ),
                actions: {
                    Button("Delete", role: .destructive) {
                        if let offsets = pendingDeleteOffsets {
                            viewModel.deleteCategories(at: offsets)
                        }
                        pendingDeleteOffsets = nil
                    }
                    Button("Cancel", role: .cancel) {
                        pendingDeleteOffsets = nil
                    }
                },
                message: {
                    Text("This can't be undone.")
                }
            )
            .errorAlert($viewModel.errorMessage)
        }
        .task {
            await viewModel.load()
        }
    }

    private func saveBaseURL() {
        guard let url = URL(string: baseURLText), url.scheme != nil, url.host != nil else {
            baseURLErrorMessage = "That doesn't look like a valid URL (e.g. http://192.168.1.23:8000)."
            return
        }
        baseURLErrorMessage = nil
        APIConfiguration.setOverride(url)
    }

    private func resetBaseURL() {
        APIConfiguration.setOverride(nil)
        baseURLText = APIConfiguration.baseURL.absoluteString
        baseURLErrorMessage = nil
    }

    private var appVersion: String {
        let shortVersion = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "?"
        let buildNumber = Bundle.main.infoDictionary?["CFBundleVersion"] as? String ?? "?"
        return "\(shortVersion) (\(buildNumber))"
    }
}
