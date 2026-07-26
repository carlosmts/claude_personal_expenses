import { categoryIcon } from '../lib/categoryStyle';

interface CategoryIconProps {
  categoryName: string;
  shape?: 'circle' | 'square';
}

export function CategoryIcon({ categoryName, shape = 'circle' }: CategoryIconProps) {
  const Icon = categoryIcon(categoryName);
  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center bg-slate-100 text-slate-900 dark:bg-slate-700 dark:text-white ${
        shape === 'circle' ? 'rounded-full' : 'rounded-xl'
      }`}
    >
      <Icon size={20} />
    </div>
  );
}
