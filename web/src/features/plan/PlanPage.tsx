import { Plus, Target, Trash2 } from 'lucide-react';
import { useState, type MouseEvent } from 'react';
import { Modal } from '../../components/Modal';
import { formatCurrency } from '../../lib/currency';
import type { Goal, GoalInput } from '../../domain/goal';
import { GoalForm } from './GoalForm';
import { useCreateGoal, useDeleteGoal, useGoals, useUpdateGoal } from './queries';

export function PlanPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const { data: goals, isLoading, error } = useGoals();
  const createGoal = useCreateGoal();
  const updateGoal = useUpdateGoal();
  const deleteGoal = useDeleteGoal();

  const openAddModal = () => {
    setEditingGoal(null);
    setModalOpen(true);
  };

  const openEditModal = (goal: Goal) => {
    setEditingGoal(goal);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingGoal(null);
  };

  const handleSubmit = (input: GoalInput) => {
    if (editingGoal) {
      updateGoal.mutate({ id: editingGoal.id, input }, { onSuccess: closeModal });
    } else {
      createGoal.mutate(input, { onSuccess: closeModal });
    }
  };

  const handleDelete = (goal: Goal, event: MouseEvent) => {
    event.stopPropagation();
    if (window.confirm(`Delete goal "${goal.name}"? This can't be undone.`)) {
      deleteGoal.mutate(goal.id);
    }
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Plan</h1>
        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center gap-1.5 rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          <Plus size={16} />
          Add Goal
        </button>
      </div>

      {isLoading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading…</p>
      ) : error ? (
        <p className="text-red-600 dark:text-red-400">{error.message}</p>
      ) : (goals ?? []).length === 0 ? (
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm dark:bg-gray-800">
          <p className="text-gray-500 dark:text-gray-400">No goals yet. Add a savings goal to track your progress.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {(goals ?? []).map((goal) => (
            <GoalCard key={goal.id} goal={goal} onClick={() => openEditModal(goal)} onDelete={(e) => handleDelete(goal, e)} />
          ))}
        </div>
      )}

      {modalOpen && (
        <Modal title={editingGoal ? 'Edit Goal' : 'New Goal'} onClose={closeModal}>
          <GoalForm
            editingGoal={editingGoal}
            onSubmit={handleSubmit}
            onCancel={closeModal}
            isSubmitting={createGoal.isPending || updateGoal.isPending}
          />
        </Modal>
      )}
    </div>
  );
}

function GoalCard({
  goal,
  onClick,
  onDelete,
}: {
  goal: Goal;
  onClick: () => void;
  onDelete: (event: MouseEvent) => void;
}) {
  const progress = goal.targetAmount > 0 ? Math.min(Math.max(goal.currentAmount / goal.targetAmount, 0), 1) : 0;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter') onClick();
      }}
      className="group flex cursor-pointer flex-col gap-3 rounded-2xl bg-white p-5 text-left shadow-sm hover:shadow-md dark:bg-gray-800"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-700 text-white">
          <Target size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-gray-900 dark:text-white">{goal.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{goal.userName}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(goal.currentAmount)}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">of {formatCurrency(goal.targetAmount)}</p>
        </div>
        <button
          type="button"
          onClick={onDelete}
          className="shrink-0 rounded-lg p-1.5 text-gray-400 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 dark:hover:bg-red-900/30 dark:hover:text-red-400"
          aria-label="Delete goal"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
        <div className="h-full rounded-full bg-slate-700" style={{ width: `${progress * 100}%` }} />
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">{Math.round(progress * 100)}% funded</p>
    </div>
  );
}
