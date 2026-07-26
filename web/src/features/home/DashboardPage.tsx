import { Plus } from 'lucide-react';
import { useMemo, useState, type FormEvent } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CategoryIcon } from '../../components/CategoryIcon';
import { GrowthBadge } from '../../components/GrowthBadge';
import { PersonFilter } from '../../components/PersonFilter';
import { formatCurrency } from '../../lib/currency';
import { percentChange } from '../../lib/percentChange';
import { todayIsoDate } from '../../lib/date';
import type { Transaction } from '../../domain/transaction';
import { useDashboardSummary } from './queries';
import { useCategories } from '../categories/queries';
import { useCreateTransaction, useTransactions } from '../transactions/queries';
import { useUsers } from '../users/queries';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 5 }, (_, index) => CURRENT_YEAR - index);

function formatAxisTick(value: number): string {
  return value >= 1000 ? `€${(value / 1000).toFixed(0)}k` : `€${value.toFixed(0)}`;
}

export function DashboardPage() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);

  const { data: summary, isLoading: isSummaryLoading, error: summaryError } = useDashboardSummary(
    selectedYear,
    selectedUserId
  );
  const { data: users } = useUsers();
  const { data: transactions } = useTransactions();

  const recentTransactions = useMemo(() => {
    const all = transactions ?? [];
    return selectedUserId === null ? all : all.filter((t) => t.userId === selectedUserId);
  }, [transactions, selectedUserId]);

  if (isSummaryLoading) {
    return <p className="text-gray-500 dark:text-gray-400">Loading…</p>;
  }

  if (summaryError || !summary) {
    return <p className="text-red-600 dark:text-red-400">{summaryError?.message ?? 'Something went wrong.'}</p>;
  }

  const balance = summary.allTimeIncome - summary.allTimeExpense;

  const currentNet = summary.currentMonthIncome - summary.currentMonthExpense;
  const previousMonthNet = summary.previousMonthIncome - summary.previousMonthExpense;
  const previousYearMonthNet = summary.previousYearMonthIncome - summary.previousYearMonthExpense;

  const balanceGrowthVsLastMonth = percentChange(currentNet, previousMonthNet);
  const balanceGrowthVsLastYear = percentChange(currentNet, previousYearMonthNet);
  const incomeGrowthVsLastMonth = percentChange(summary.currentMonthIncome, summary.previousMonthIncome);
  const expenseGrowthVsLastMonth = percentChange(summary.currentMonthExpense, summary.previousMonthExpense);

  const chartData = summary.monthlyBreakdown.map((entry) => ({
    month: MONTH_LABELS[entry.month - 1],
    income: entry.income,
    expense: entry.expense,
  }));

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <PersonFilter users={users ?? []} selectedUserId={selectedUserId} onChange={setSelectedUserId} />
        </div>

        <div className="rounded-3xl bg-slate-900 p-6 text-white">
          <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Current Balance</p>
          <p className="mt-2 text-4xl font-bold">{formatCurrency(balance)}</p>
          <div className="mt-3 flex flex-wrap gap-4">
            <GrowthBadge
              label="vs last month"
              percent={balanceGrowthVsLastMonth}
              positiveIsGood
              variant="onDark"
            />
            <GrowthBadge label="vs last year" percent={balanceGrowthVsLastYear} positiveIsGood variant="onDark" />
          </div>
          <MiniMonthlyChart chartData={chartData} />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-5 shadow-sm dark:bg-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">Income (this month)</p>
            <p className="mt-1 text-3xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(summary.currentMonthIncome)}
            </p>
            <div className="mt-3">
              <GrowthBadge label="vs last month" percent={incomeGrowthVsLastMonth} positiveIsGood />
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm dark:bg-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">Expenses (this month)</p>
            <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(summary.currentMonthExpense)}
            </p>
            <div className="mt-3">
              <GrowthBadge label="vs last month" percent={expenseGrowthVsLastMonth} positiveIsGood={false} />
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Monthly Overview</h2>
            <select
              value={selectedYear}
              onChange={(event) => setSelectedYear(Number(event.target.value))}
              className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            >
              {YEAR_OPTIONS.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="text-gray-400 dark:text-gray-500">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: 'currentColor' }} tickLine={false} axisLine={false} />
                <YAxis
                  tick={{ fill: 'currentColor' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={formatAxisTick}
                />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Bar dataKey="income" name="Income" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Expenses" fill="#0f172a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 xl:sticky xl:top-8 xl:h-[calc(100vh-4rem)]">
        <QuickActionPanel />

        <div className="flex min-h-0 flex-1 flex-col rounded-3xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <h2 className="mb-4 shrink-0 text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h2>
          {recentTransactions.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No transactions yet.</p>
          ) : (
            <ul className="flex flex-1 flex-col divide-y divide-gray-100 overflow-y-auto dark:divide-gray-700">
              {recentTransactions.map((transaction) => (
                <TransactionRow key={transaction.id} transaction={transaction} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function MiniMonthlyChart({ chartData }: { chartData: { month: string; income: number; expense: number }[] }) {
  const totals = chartData.map((entry) => entry.income + entry.expense);
  const max = Math.max(...totals, 1);
  const lastActiveIndex = totals.reduce((last, value, index) => (value > 0 ? index : last), 0);

  return (
    <div className="mt-6 flex h-16 items-stretch gap-1.5">
      {chartData.map((entry, index) => {
        const isHighlighted = index === lastActiveIndex;
        const heightPercent = Math.max((totals[index] / max) * 100, 10);
        return (
          <div key={entry.month} className="flex flex-1 flex-col items-center justify-end gap-1">
            <div
              className={`w-full rounded-t ${isHighlighted ? 'bg-blue-300' : 'bg-slate-600'}`}
              style={{ height: `${heightPercent}%` }}
            />
            {index % 2 === 0 && <span className="text-[10px] text-slate-400">{entry.month}</span>}
          </div>
        );
      })}
    </div>
  );
}

function QuickActionPanel() {
  const { data: categories } = useCategories();
  const { data: users } = useUsers();
  const createTransaction = useCreateTransaction();

  const [amount, setAmount] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [userId, setUserId] = useState<number | null>(null);

  const effectiveUserId = userId ?? users?.[0]?.id ?? null;
  const parsedAmount = Number(amount);
  const isValid = amount.trim() !== '' && parsedAmount > 0 && categoryName.trim() !== '' && effectiveUserId !== null;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!isValid || effectiveUserId === null) return;
    createTransaction.mutate(
      {
        date: todayIsoDate(),
        type,
        amount: parsedAmount,
        categoryName: categoryName.trim(),
        userId: effectiveUserId,
        description: null,
      },
      {
        onSuccess: () => {
          setAmount('');
          setCategoryName('');
        },
      }
    );
  };

  return (
    <div className="shrink-0 rounded-3xl bg-slate-100 p-6 dark:bg-gray-800/60">
      <div className="mb-4 flex items-center gap-2 text-gray-500 dark:text-gray-400">
        <Plus size={16} />
        <span className="text-xs font-semibold tracking-wide uppercase">Quick Action</span>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-1 rounded-full bg-white p-1 dark:bg-gray-700">
          {(['expense', 'income'] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setType(option)}
              className={`rounded-full py-1 text-xs font-medium capitalize transition-colors ${
                type === option
                  ? 'bg-slate-900 text-white'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
            Amount (€)
          </span>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="0.00"
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
            Category
          </span>
          <input
            type="text"
            list="quick-action-categories"
            value={categoryName}
            onChange={(event) => setCategoryName(event.target.value)}
            placeholder="e.g. Groceries"
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <datalist id="quick-action-categories">
            {(categories ?? []).map((category) => (
              <option key={category.id} value={category.name} />
            ))}
          </datalist>
        </label>

        {users && users.length > 0 && (
          <div className="grid grid-cols-2 gap-1 rounded-full bg-white p-1 dark:bg-gray-700">
            {users.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => setUserId(user.id)}
                className={`rounded-full py-1 text-xs font-medium transition-colors ${
                  effectiveUserId === user.id
                    ? 'bg-slate-900 text-white'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                {user.name}
              </button>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={!isValid || createTransaction.isPending}
          className="mt-1 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-950 disabled:opacity-50"
        >
          {createTransaction.isPending ? 'Recording…' : 'Record Entry'}
        </button>
      </form>
    </div>
  );
}

function TransactionRow({ transaction }: { transaction: Transaction }) {
  const signedAmount = transaction.type === 'expense' ? -transaction.amount : transaction.amount;
  return (
    <li className="flex items-center gap-3 py-3">
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
    </li>
  );
}
