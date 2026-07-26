import { useState, type FormEvent } from 'react';
import { useUsers } from '../users/queries';
import type { Goal, GoalInput } from '../../domain/goal';

type OwnerSelection = number | 'both' | null;

interface GoalFormProps {
  editingGoal: Goal | null;
  onSubmit: (input: GoalInput) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function GoalForm({ editingGoal, onSubmit, onCancel, isSubmitting }: GoalFormProps) {
  const { data: users } = useUsers();

  const [name, setName] = useState(editingGoal?.name ?? '');
  const [targetAmount, setTargetAmount] = useState(editingGoal ? String(editingGoal.targetAmount) : '');
  const [currentAmount, setCurrentAmount] = useState(editingGoal ? String(editingGoal.currentAmount) : '0');
  const [owner, setOwner] = useState<OwnerSelection>(
    editingGoal ? editingGoal.userId ?? 'both' : null
  );

  const parsedTarget = Number(targetAmount);
  const parsedCurrent = currentAmount.trim() === '' ? 0 : Number(currentAmount);
  const isValid =
    name.trim() !== '' &&
    targetAmount.trim() !== '' &&
    parsedTarget > 0 &&
    parsedCurrent >= 0 &&
    owner !== null;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!isValid || owner === null) return;
    onSubmit({
      userId: owner === 'both' ? null : owner,
      name: name.trim(),
      targetAmount: parsedTarget,
      currentAmount: parsedCurrent,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Goal Name</span>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. New car"
          required
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Target Amount (EUR)</span>
        <input
          type="number"
          min="0.01"
          step="0.01"
          value={targetAmount}
          onChange={(event) => setTargetAmount(event.target.value)}
          placeholder="0.00"
          required
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Progress (EUR)</span>
        <input
          type="number"
          min="0"
          step="0.01"
          value={currentAmount}
          onChange={(event) => setCurrentAmount(event.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </label>

      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Whose goal is this?</span>
        <div className="grid grid-cols-3 gap-2 rounded-full bg-gray-100 p-1 dark:bg-gray-700">
          {(users ?? []).map((user) => (
            <button
              key={user.id}
              type="button"
              onClick={() => setOwner(user.id)}
              className={`rounded-full py-1.5 text-sm font-medium transition-colors ${
                owner === user.id
                  ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-white'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              {user.name}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setOwner('both')}
            className={`rounded-full py-1.5 text-sm font-medium transition-colors ${
              owner === 'both'
                ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-white'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            Both
          </button>
        </div>
      </div>

      <div className="mt-2 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-950 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  );
}
