import type { ReactNode } from 'react';
import { InitialsAvatar } from './InitialsAvatar';
import type { User } from '../domain/user';

interface PersonFilterProps {
  users: User[];
  selectedUserId: number | null;
  onChange: (userId: number | null) => void;
}

export function PersonFilter({ users, selectedUserId, onChange }: PersonFilterProps) {
  return (
    <div className="inline-flex rounded-full bg-white p-1 shadow-sm dark:bg-gray-800">
      <FilterButton active={selectedUserId === null} onClick={() => onChange(null)}>
        All
      </FilterButton>
      {users.map((user) => (
        <FilterButton key={user.id} active={selectedUserId === user.id} onClick={() => onChange(user.id)}>
          <InitialsAvatar name={user.name} userId={user.id} size={18} />
          {user.name}
        </FilterButton>
      ))}
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
        active
          ? 'bg-slate-900 text-white'
          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
      }`}
    >
      {children}
    </button>
  );
}
