interface StatCardProps {
  title: string;
  value: string;
  valueClassName?: string;
}

export function StatCard({ title, value, valueClassName = 'text-gray-900' }: StatCardProps) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`mt-1 text-xl font-bold ${valueClassName}`}>{value}</p>
    </div>
  );
}
