import { useMemo, useState } from 'react';
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
import type { Transaction } from '../../domain/transaction';
import { useDashboardSummary } from './queries';
import { useTransactions } from '../transactions/queries';
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
  const flowTotal = summary.allTimeIncome + summary.allTimeExpense;
  const incomeShare = flowTotal > 0 ? (summary.allTimeIncome / flowTotal) * 100 : 0;
  const expenseShare = flowTotal > 0 ? (summary.allTimeExpense / flowTotal) * 100 : 0;

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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm dark:bg-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">Current Balance</p>
            <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(balance)}</p>
            <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>
                Income{' '}
                <span className="font-medium text-green-600 dark:text-green-400">
                  {formatCurrency(summary.allTimeIncome)}
                </span>{' '}
                ({incomeShare.toFixed(0)}%)
              </span>
              <span>
                Expenses{' '}
                <span className="font-medium text-red-600 dark:text-red-400">
                  {formatCurrency(summary.allTimeExpense)}
                </span>{' '}
                ({expenseShare.toFixed(0)}%)
              </span>
            </div>
            <div className="mt-3 flex gap-3">
              <GrowthBadge label="vs last month" percent={balanceGrowthVsLastMonth} positiveIsGood />
              <GrowthBadge label="vs last year" percent={balanceGrowthVsLastYear} positiveIsGood />
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm dark:bg-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">Income (this month)</p>
            <p className="mt-1 text-3xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(summary.currentMonthIncome)}
            </p>
            <div className="mt-3">
              <GrowthBadge label="vs last month" percent={incomeGrowthVsLastMonth} positiveIsGood />
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm dark:bg-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">Expenses (this month)</p>
            <p className="mt-1 text-3xl font-bold text-red-600 dark:text-red-400">
              {formatCurrency(summary.currentMonthExpense)}
            </p>
            <div className="mt-3">
              <GrowthBadge label="vs last month" percent={expenseGrowthVsLastMonth} positiveIsGood={false} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Monthly Overview</h2>
            <select
              value={selectedYear}
              onChange={(event) => setSelectedYear(Number(event.target.value))}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
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
                <Bar dataKey="expense" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="xl:sticky xl:top-8 xl:h-[calc(100vh-4rem)]">
        <div className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
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

function TransactionRow({ transaction }: { transaction: Transaction }) {
  const signedAmount = transaction.type === 'expense' ? -transaction.amount : transaction.amount;
  return (
    <li className="flex items-center gap-3 py-3">
      <CategoryIcon categoryName={transaction.categoryName} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-gray-900 dark:text-white">{transaction.categoryName}</p>
        {transaction.description ? (
          <p className="truncate text-sm text-gray-500 dark:text-gray-400">{transaction.description}</p>
        ) : null}
        <p className="text-xs text-gray-400 dark:text-gray-500">
          {transaction.userName} · {transaction.date}
        </p>
      </div>
      <p
        className={`shrink-0 font-semibold ${transaction.type === 'expense' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}
      >
        {formatCurrency(signedAmount)}
      </p>
    </li>
  );
}
