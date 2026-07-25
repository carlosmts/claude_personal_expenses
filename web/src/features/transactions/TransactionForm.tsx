import { useState, type FormEvent } from 'react';
import { useCategories } from '../categories/queries';
import { useUsers } from '../users/queries';
import type { Transaction, TransactionInput, TransactionType } from '../../domain/transaction';

interface TransactionFormProps {
  editingTransaction: Transaction | null;
  onSubmit: (input: TransactionInput) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

function todayIsoDate(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

export function TransactionForm({ editingTransaction, onSubmit, onCancel, isSubmitting }: TransactionFormProps) {
  const { data: categories } = useCategories();
  const { data: users } = useUsers();

  const [type, setType] = useState<TransactionType>(editingTransaction?.type ?? 'expense');
  const [date, setDate] = useState(editingTransaction?.date ?? todayIsoDate());
  const [amount, setAmount] = useState(editingTransaction ? String(editingTransaction.amount) : '');
  const [categoryName, setCategoryName] = useState(editingTransaction?.categoryName ?? '');
  const [description, setDescription] = useState(editingTransaction?.description ?? '');
  const [userId, setUserId] = useState<number | null>(editingTransaction?.userId ?? users?.[0]?.id ?? null);

  const parsedAmount = Number(amount);
  const isValid = amount.trim() !== '' && parsedAmount > 0 && categoryName.trim() !== '' && userId !== null;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!isValid || userId === null) return;
    onSubmit({
      date,
      type,
      amount: parsedAmount,
      categoryName: categoryName.trim(),
      userId,
      description: description.trim() === '' ? null : description.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2 rounded-xl bg-gray-100 p-1">
        {(['expense', 'income'] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setType(option)}
            className={`rounded-lg py-1.5 text-sm font-medium capitalize transition-colors ${
              type === option ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-700">Date</span>
        <input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          required
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-700">Amount (EUR)</span>
        <input
          type="number"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="0.00"
          required
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-700">Category</span>
        <input
          type="text"
          list="category-options"
          value={categoryName}
          onChange={(event) => setCategoryName(event.target.value)}
          placeholder="e.g. Groceries"
          required
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
        />
        <datalist id="category-options">
          {(categories ?? []).map((category) => (
            <option key={category.id} value={category.name} />
          ))}
        </datalist>
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-700">Description (optional)</span>
        <input
          type="text"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
        />
      </label>

      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-700">Who's entering this?</span>
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-gray-100 p-1">
          {(users ?? []).map((user) => (
            <button
              key={user.id}
              type="button"
              onClick={() => setUserId(user.id)}
              className={`rounded-lg py-1.5 text-sm font-medium transition-colors ${
                userId === user.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {user.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-2 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  );
}
