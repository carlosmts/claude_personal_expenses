import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { CategoryIcon } from '../../components/CategoryIcon';
import { formatCurrency } from '../../lib/currency';
import { categoryStyle } from '../../lib/categoryStyle';
import { percentChange } from '../../lib/percentChange';
import type { CategoryAmount, UserAmount } from '../../domain/summary';
import { useMonthlySummary } from './queries';

type TransactionType = 'expense' | 'income';

const now = new Date();

function addMonths(year: number, month: number, delta: number): { year: number; month: number } {
  const zeroBased = month - 1 + delta;
  const newYear = year + Math.floor(zeroBased / 12);
  const newMonth = ((zeroBased % 12) + 12) % 12;
  return { year: newYear, month: newMonth + 1 };
}

function monthTitle(year: number, month: number): string {
  return new Date(year, month - 1, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}

export function ReportPage() {
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedType, setSelectedType] = useState<TransactionType>('expense');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const isCurrentMonth = selectedYear === now.getFullYear() && selectedMonth === now.getMonth() + 1;
  const previous = addMonths(selectedYear, selectedMonth, -1);

  const { data: summary, isLoading, error } = useMonthlySummary(selectedYear, selectedMonth);
  const { data: previousSummary } = useMonthlySummary(previous.year, previous.month);

  const goToPreviousMonth = () => {
    const { year, month } = addMonths(selectedYear, selectedMonth, -1);
    setSelectedYear(year);
    setSelectedMonth(month);
    setActiveIndex(null);
  };

  const goToNextMonth = () => {
    if (isCurrentMonth) return;
    const { year, month } = addMonths(selectedYear, selectedMonth, 1);
    setSelectedYear(year);
    setSelectedMonth(month);
    setActiveIndex(null);
  };

  const total = summary ? (selectedType === 'expense' ? summary.totalExpense : summary.totalIncome) : 0;
  const previousTotal = previousSummary
    ? selectedType === 'expense'
      ? previousSummary.totalExpense
      : previousSummary.totalIncome
    : null;
  const growth = previousTotal !== null ? percentChange(total, previousTotal) : null;

  const categories = useMemo(() => {
    const list = summary ? (selectedType === 'expense' ? summary.expensesByCategory : summary.incomeByCategory) : [];
    return [...list].sort((a, b) => b.amount - a.amount);
  }, [summary, selectedType]);

  const topCategory = categories[0];
  const topCategoryPercent = topCategory && total > 0 ? (topCategory.amount / total) * 100 : 0;

  if (isLoading) {
    return <p className="text-gray-500 dark:text-gray-400">Loading…</p>;
  }

  if (error || !summary) {
    return <p className="text-red-600 dark:text-red-400">{error?.message ?? 'Something went wrong.'}</p>;
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Report</h1>

        <div className="flex items-center gap-1 rounded-xl bg-white p-1 shadow-sm dark:bg-gray-800">
          <button
            type="button"
            onClick={goToPreviousMonth}
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            aria-label="Previous month"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="min-w-[140px] text-center text-sm font-medium text-gray-900 dark:text-white">
            {monthTitle(selectedYear, selectedMonth)}
          </span>
          <button
            type="button"
            onClick={goToNextMonth}
            disabled={isCurrentMonth}
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent dark:text-gray-300 dark:hover:bg-gray-700"
            aria-label="Next month"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-xl bg-white p-1 shadow-sm sm:max-w-xs dark:bg-gray-800">
        {(['expense', 'income'] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => {
              setSelectedType(option);
              setActiveIndex(null);
            }}
            className={`rounded-lg py-1.5 text-sm font-medium capitalize transition-colors ${
              selectedType === option
                ? option === 'expense'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-green-600 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {categories.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm dark:bg-gray-800">
          <p className="text-gray-500 dark:text-gray-400">
            No {selectedType} data recorded for {monthTitle(selectedYear, selectedMonth)} yet.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="flex flex-col gap-6">
              <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
                <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-stretch">
                  <div className="relative h-64 w-64 shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categories}
                          dataKey="amount"
                          nameKey="categoryName"
                          innerRadius="62%"
                          outerRadius="100%"
                          paddingAngle={categories.length > 1 ? 3 : 0}
                          cornerRadius={6}
                          stroke="none"
                          onMouseEnter={(_, index) => setActiveIndex(index)}
                          onMouseLeave={() => setActiveIndex(null)}
                        >
                          {categories.map((category, index) => (
                            <Cell
                              key={category.categoryId}
                              fill={categoryStyle(category.categoryName).color}
                              opacity={activeIndex === null || activeIndex === index ? 1 : 0.3}
                              className="cursor-pointer transition-opacity"
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => formatCurrency(Number(value))}
                          contentStyle={{
                            backgroundColor: 'rgba(30,41,59,0.95)',
                            border: 'none',
                            borderRadius: 8,
                            color: '#fff',
                          }}
                          itemStyle={{ color: '#fff' }}
                          labelStyle={{ color: '#fff' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
                      {activeIndex !== null && categories[activeIndex] ? (
                        <>
                          <span className="truncate text-xs font-medium text-gray-500 dark:text-gray-400">
                            {categories[activeIndex].categoryName}
                          </span>
                          <span className="text-xl font-bold text-gray-900 dark:text-white">
                            {formatCurrency(categories[activeIndex].amount)}
                          </span>
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            {total > 0 ? Math.round((categories[activeIndex].amount / total) * 100) : 0}% of total
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            Total {selectedType}
                          </span>
                          <span
                            className={`text-2xl font-bold ${selectedType === 'expense' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}
                          >
                            {formatCurrency(total)}
                          </span>
                          {growth !== null && (
                            <span className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                              {growth >= 0 ? '+' : ''}
                              {growth.toFixed(0)}% vs last month
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {topCategory && (
                    <div className="flex flex-1 flex-col justify-center gap-2 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-5 dark:from-gray-700 dark:to-gray-700/60">
                      <div className="flex items-center gap-2 text-slate-500 dark:text-gray-300">
                        <Sparkles size={16} />
                        <span className="text-xs font-semibold tracking-wide uppercase">Insight</span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-200">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {topCategory.categoryName}
                        </span>{' '}
                        was your biggest {selectedType} this month — {formatCurrency(topCategory.amount)} (
                        {Math.round(topCategoryPercent)}% of the total).
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">By Category</h2>
              <div className="flex flex-col gap-4">
                {categories.map((category) => (
                  <CategoryBreakdownRow key={category.categoryId} category={category} total={total} />
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">By Person</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {summary.byUser.map((userAmount) => (
                <PersonBreakdownCard key={userAmount.userId} userAmount={userAmount} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function CategoryBreakdownRow({ category, total }: { category: CategoryAmount; total: number }) {
  const percent = total > 0 ? (category.amount / total) * 100 : 0;
  const { color } = categoryStyle(category.categoryName);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <CategoryIcon categoryName={category.categoryName} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-gray-900 dark:text-white">{category.categoryName}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{Math.round(percent)}% of total</p>
        </div>
        <p className="shrink-0 font-semibold text-gray-900 dark:text-white">{formatCurrency(category.amount)}</p>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
        <div className="h-full rounded-full transition-all" style={{ width: `${percent}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function PersonBreakdownCard({ userAmount }: { userAmount: UserAmount }) {
  const net = userAmount.totalIncome - userAmount.totalExpense;
  const flow = userAmount.totalIncome + userAmount.totalExpense;
  const incomeShare = flow > 0 ? (userAmount.totalIncome / flow) * 100 : 0;

  return (
    <div className="rounded-xl border border-gray-100 p-4 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-gray-900 dark:text-white">{userAmount.userName}</span>
        <span className={`font-semibold ${net >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {formatCurrency(net)}
        </span>
      </div>
      <div className="mt-3 flex h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
        {flow > 0 ? (
          <>
            <div className="h-full bg-green-500" style={{ width: `${incomeShare}%` }} />
            <div className="h-full bg-red-500" style={{ width: `${100 - incomeShare}%` }} />
          </>
        ) : null}
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>Income {formatCurrency(userAmount.totalIncome)}</span>
        <span>Expenses {formatCurrency(userAmount.totalExpense)}</span>
      </div>
    </div>
  );
}
