import { categoryStyle } from '../lib/categoryStyle';

interface CategoryIconProps {
  categoryName: string;
}

export function CategoryIcon({ categoryName }: CategoryIconProps) {
  const { icon: Icon, color } = categoryStyle(categoryName);
  return (
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white"
      style={{ backgroundColor: color }}
    >
      <Icon size={20} />
    </div>
  );
}
