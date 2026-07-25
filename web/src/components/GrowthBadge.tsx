import { ArrowDown, ArrowUp } from 'lucide-react';

interface GrowthBadgeProps {
  label: string;
  percent: number | null;
  /** Whether an increase (positive %) counts as good — true for income/net, false for expenses. */
  positiveIsGood: boolean;
}

export function GrowthBadge({ label, percent, positiveIsGood }: GrowthBadgeProps) {
  if (percent === null) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-gray-400">
        {label}: <span className="font-medium">New</span>
      </span>
    );
  }

  const isPositive = percent >= 0;
  const isGood = isPositive === positiveIsGood;
  const Icon = isPositive ? ArrowUp : ArrowDown;

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
      {label}:
      <span
        className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium ${
          isGood ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}
      >
        <Icon size={11} />
        {Math.abs(percent).toFixed(1)}%
      </span>
    </span>
  );
}
