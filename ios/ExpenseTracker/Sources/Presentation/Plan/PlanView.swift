import SwiftUI

private enum GoalFormMode: Identifiable {
    case add
    case edit(Goal)

    var id: String {
        switch self {
        case .add:
            return "add"
        case let .edit(goal):
            return "edit-\(goal.id)"
        }
    }
}

struct PlanView: View {
    @StateObject private var viewModel: PlanViewModel
    @State private var formMode: GoalFormMode?
    @State private var pendingDeleteOffsets: IndexSet?

    init(viewModel: PlanViewModel) {
        _viewModel = StateObject(wrappedValue: viewModel)
    }

    var body: some View {
        NavigationStack {
            Group {
                if viewModel.isLoading && viewModel.goals.isEmpty {
                    ProgressView()
                } else if viewModel.goals.isEmpty {
                    ContentUnavailableView(
                        "No Goals Yet",
                        systemImage: "target",
                        description: Text("Add a savings goal to track your progress.")
                    )
                } else {
                    List {
                        ForEach(viewModel.goals) { goal in
                            Button {
                                formMode = .edit(goal)
                            } label: {
                                GoalRowView(goal: goal)
                            }
                            .buttonStyle(.plain)
                            .listRowInsets(EdgeInsets(top: 6, leading: 16, bottom: 6, trailing: 16))
                            .listRowSeparator(.hidden)
                        }
                        .onDelete { offsets in
                            pendingDeleteOffsets = offsets
                        }
                    }
                    .listStyle(.plain)
                    .refreshable {
                        await viewModel.load()
                    }
                }
            }
            .navigationTitle("Plan")
            .toolbar {
                ToolbarItem(placement: .primaryAction) {
                    Button {
                        formMode = .add
                    } label: {
                        Image(systemName: "plus")
                    }
                }
            }
            .sheet(item: $formMode) { mode in
                switch mode {
                case .add:
                    GoalFormView(viewModel: viewModel)
                case let .edit(goal):
                    GoalFormView(viewModel: viewModel, editingGoal: goal)
                }
            }
            .alert(
                "Delete Goal?",
                isPresented: Binding(
                    get: { pendingDeleteOffsets != nil },
                    set: { isPresented in
                        if !isPresented { pendingDeleteOffsets = nil }
                    }
                ),
                actions: {
                    Button("Delete", role: .destructive) {
                        if let offsets = pendingDeleteOffsets {
                            viewModel.deleteGoals(at: offsets)
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
            .alert(
                "Something went wrong",
                isPresented: .constant(viewModel.errorMessage != nil),
                actions: {
                    Button("OK") { viewModel.errorMessage = nil }
                },
                message: {
                    Text(viewModel.errorMessage ?? "")
                }
            )
        }
        .task {
            await viewModel.load()
        }
    }
}
