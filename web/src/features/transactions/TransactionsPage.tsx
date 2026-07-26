import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { CategoryIcon } from '../../components/CategoryIcon';
import { Modal } from '../../components/Modal';
import { PersonFilter } from '../../components/PersonFilter';
import { formatCurrency } from '../../lib/currency';
import type { Transaction, TransactionInput } from '../../domain/transaction';
import { useUsers } from '../users/queries';
import { TransactionForm } from './TransactionForm';
import { useCreateTransaction, useDeleteTransaction, useTransactions, useUpdateTransaction } from './queries';

export function TransactionsPage() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const { data: users } = useUsers();
  const { data: transactions, isLoading, error } = useTransactions();
  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();
  const deleteTransaction = useDeleteTransaction();

  const filteredTransactions = useMemo(() => {
    const all = transactions ?? [];
    const filtered = selectedUserId === null ? all : all.filter((t) => t.userId === selectedUserId);
    return [...filtered].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
  }, [transactions, selectedUserId]);

  const openAddModal = () => {
    setEditingTransaction(null);
    setModalOpen(true);
  };

  const openEditModal = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTransaction(null);
  };

  const handleSubmit = (input: TransactionInput) => {
    if (editingTransaction) {
      updateTransaction.mutate(
        { id: editingTransaction.id, input },
        { onSuccess: closeModal }
      );
    } else {
      createTransaction.mutate(input, { onSuccess: closeModal });
    }
  };

  const handleDelete = (transaction: Transaction) => {
    if (window.confirm(`Delete "${transaction.categoryName}" (${formatCurrency(transaction.amount)})?`)) {
      deleteTransaction.mutate(transaction.id);
    }
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h1>
        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-950"
        >
          <Plus size={16} />
          Add Transaction
        </button>
      </div>

      <PersonFilter users={users ?? []} selectedUserId={selectedUserId} onChange={setSelectedUserId} />

      <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-gray-800">
        {isLoading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading…</p>
        ) : error ? (
          <p className="text-red-600 dark:text-red-400">{error.message}</p>
        ) : filteredTransactions.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No transactions yet.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-gray-100 dark:divide-gray-700">
            {filteredTransactions.map((transaction) => (
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
                onEdit={() => openEditModal(transaction)}
                onDelete={() => handleDelete(transaction)}
              />
            ))}
          </ul>
        )}
      </div>

      {modalOpen && (
        <Modal title={editingTransaction ? 'Edit Transaction' : 'Add Transaction'} onClose={closeModal}>
          <TransactionForm
            editingTransaction={editingTransaction}
            onSubmit={handleSubmit}
            onCancel={closeModal}
            isSubmitting={createTransaction.isPending || updateTransaction.isPending}
          />
        </Modal>
      )}
    </div>
  );
}

function TransactionRow({
  transaction,
  onEdit,
  onDelete,
}: {
  transaction: Transaction;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const signedAmount = transaction.type === 'expense' ? -transaction.amount : transaction.amount;
  return (
    <li className="group flex items-center gap-3 py-3">
      <CategoryIcon categoryName={transaction.categoryName} shape="square" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-medium text-gray-900 dark:text-white">{transaction.categoryName}</p>
          <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-gray-500 uppercase dark:bg-gray-700 dark:text-gray-400">
            {transaction.userName}
          </span>
        </div>
        {transaction.description ? (
          <p className="truncate text-sm text-gray-500 dark:text-gray-400">{transaction.description}</p>
        ) : null}
        <p className="text-xs text-gray-400 dark:text-gray-500">{transaction.date}</p>
      </div>
      <p
        className={`shrink-0 font-semibold ${transaction.type === 'expense' ? 'text-gray-900 dark:text-white' : 'text-green-600 dark:text-green-400'}`}
      >
        {formatCurrency(signedAmount)}
      </p>
      <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          onClick={onEdit}
          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          aria-label="Edit"
        >
          <Pencil size={16} />
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
          aria-label="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </li>
  );
}
