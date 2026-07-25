import { formatCurrency } from '../lib/currency';

interface BalanceCardProps {
  balance: number;
}

export function BalanceCard({ balance }: BalanceCardProps) {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-indigo-500 to-indigo-700 p-6 text-white shadow-sm">
      <p className="text-sm text-indigo-100">Current Balance</p>
      <p className="mt-1 text-4xl font-bold">{formatCurrency(balance)}</p>
    </div>
  );
}
