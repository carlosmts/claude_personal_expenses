import { ArrowDown, ArrowUp } from 'lucide-react';

interface GrowthBadgeProps {
  label: string;
  percent: number | null;
  /** Whether an increase (positive %) counts as good — true for income/net, false for expenses. */
  positiveIsGood: boolean;
  /** 'onDark' for use on the always-dark hero card, independent of light/dark page theme. */
  variant?: 'default' | 'onDark';
}

export function GrowthBadge({ label, percent, positiveIsGood, variant = 'default' }: GrowthBadgeProps) {
  const labelClass = variant === 'onDark' ? 'text-slate-400' : 'text-gray-500 dark:text-gray-400';

  if (percent === null) {
    return (
      <span className={`inline-flex items-center gap-1 text-xs ${variant === 'onDark' ? 'text-slate-500' : 'text-gray-400 dark:text-gray-500'}`}>
        {label}: <span className="font-medium">New</span>
      </span>
    );
  }

  const isPositive = percent >= 0;
  const isGood = isPositive === positiveIsGood;
  const Icon = isPositive ? ArrowUp : ArrowDown;
  const badClass = variant === 'onDark' ? 'text-white' : 'text-gray-900 dark:text-white';
  const goodClass = variant === 'onDark' ? 'text-green-400' : 'text-green-600 dark:text-green-400';

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs ${labelClass}`}>
      {label}:
      <span className={`inline-flex items-center gap-0.5 font-medium ${isGood ? goodClass : badClass}`}>
        <Icon size={11} />
        {Math.abs(percent).toFixed(1)}%
      </span>
    </span>
  );
}
