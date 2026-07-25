import { useMemo } from 'react';
import { CategoryIcon } from '../../components/CategoryIcon';
import { BalanceCard } from '../../components/BalanceCard';
import { StatCard } from '../../components/StatCard';
import { formatCurrency } from '../../lib/currency';
import type { Transaction } from '../../domain/transaction';
import { useTransactions } from '../transactions/queries';

function isSameMonth(dateStr: string, reference: Date): boolean {
  const date = new Date(dateStr);
  return date.getFullYear() === reference.getFullYear() && date.getMonth() === reference.getMonth();
}

export function DashboardPage() {
  const { data: transactions, isLoading, error } = useTransactions();

  const { balance, monthlyIncome, monthlyExpenses, recent } = useMemo(() => {
    const all = transactions ?? [];
    const now = new Date();
    const monthly = all.filter((transaction) => isSameMonth(transaction.date, now));

    return {
      balance: all.reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0),
      monthlyIncome: monthly.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
      monthlyExpenses: monthly.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
      recent: all.slice(0, 8),
    };
  }, [transactions]);

  if (isLoading) {
    return <p className="text-gray-500">Loading…</p>;
  }

  if (error) {
    return <p className="text-red-600">{error.message}</p>;
  }

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      <BalanceCard balance={balance} />

      <div className="grid grid-cols-2 gap-4">
        <StatCard
          title="Income (this month)"
          value={formatCurrency(monthlyIncome)}
          valueClassName="text-green-600"
        />
        <StatCard
          title="Expenses (this month)"
          value={formatCurrency(monthlyExpenses)}
          valueClassName="text-red-600"
        />
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Recent Transactions</h2>
        {recent.length === 0 ? (
          <p className="text-gray-500">No transactions yet.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-gray-100">
            {recent.map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function TransactionRow({ transaction }: { transaction: Transaction }) {
  const signedAmount = transaction.type === 'expense' ? -transaction.amount : transaction.amount;
  return (
    <li className="flex items-center gap-4 py-3">
      <CategoryIcon categoryName={transaction.categoryName} />
      <div className="min-w-0 flex-1">
        <p className="font-medium text-gray-900">{transaction.categoryName}</p>
        {transaction.description ? <p className="truncate text-sm text-gray-500">{transaction.description}</p> : null}
        <p className="text-xs text-gray-400">
          {transaction.userName} · {transaction.date}
        </p>
      </div>
      <p className={`shrink-0 font-semibold ${transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'}`}>
        {formatCurrency(signedAmount)}
      </p>
    </li>
  );
}
