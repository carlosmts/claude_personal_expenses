import SwiftUI

struct LoginView: View {
    @ObservedObject var viewModel: LoginViewModel
    @FocusState private var focusedField: Field?

    private enum Field {
        case username, password
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                HStack(spacing: 8) {
                    Image(systemName: "eurosign.circle.fill")
                        .font(.system(size: 32))
                        .foregroundStyle(Theme.brandPrimary)
                    Text("Finbond")
                        .font(.title2.bold())
                }
                .padding(.bottom, 8)

                VStack(alignment: .leading, spacing: 4) {
                    Text("USERNAME")
                        .font(.caption2.bold())
                        .foregroundStyle(.secondary)
                    TextField("", text: $viewModel.username)
                        .textInputAutocapitalization(.never)
                        .autocorrectionDisabled()
                        .focused($focusedField, equals: .username)
                        .submitLabel(.next)
                        .onSubmit { focusedField = .password }
                        .padding(12)
                        .background(Color(.tertiarySystemFill))
                        .clipShape(RoundedRectangle(cornerRadius: 12))
                }

                VStack(alignment: .leading, spacing: 4) {
                    Text("PASSWORD")
                        .font(.caption2.bold())
                        .foregroundStyle(.secondary)
                    SecureField("", text: $viewModel.password)
                        .focused($focusedField, equals: .password)
                        .submitLabel(.go)
                        .onSubmit { Task { await viewModel.signIn() } }
                        .padding(12)
                        .background(Color(.tertiarySystemFill))
                        .clipShape(RoundedRectangle(cornerRadius: 12))
                }

                Text("First time signing in? Just pick a password — it'll be set for your username.")
                    .font(.caption)
                    .foregroundStyle(.secondary)

                if let errorMessage = viewModel.errorMessage {
                    Text(errorMessage)
                        .font(.footnote)
                        .foregroundStyle(Theme.expense)
                }

                Button {
                    Task { await viewModel.signIn() }
                } label: {
                    if viewModel.isSubmitting {
                        ProgressView().frame(maxWidth: .infinity)
                    } else {
                        Text("Sign In").frame(maxWidth: .infinity)
                    }
                }
                .buttonStyle(.borderedProminent)
                .tint(Theme.brandPrimary)
                .disabled(viewModel.username.isEmpty || viewModel.password.isEmpty || viewModel.isSubmitting)
                .padding(.top, 4)
            }
            .padding(24)
            .background(Color(.secondarySystemGroupedBackground))
            .clipShape(RoundedRectangle(cornerRadius: Theme.cardCornerRadius))
            .padding(24)
            .padding(.top, 80)
        }
        .background(Theme.pageBackground)
        .scrollDismissesKeyboard(.interactively)
    }
}
