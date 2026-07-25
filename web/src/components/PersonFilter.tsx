import type { ReactNode } from 'react';
import type { User } from '../domain/user';

interface PersonFilterProps {
  users: User[];
  selectedUserId: number | null;
  onChange: (userId: number | null) => void;
}

export function PersonFilter({ users, selectedUserId, onChange }: PersonFilterProps) {
  return (
    <div className="inline-flex rounded-xl bg-white p-1 shadow-sm">
      <FilterButton active={selectedUserId === null} onClick={() => onChange(null)}>
        All
      </FilterButton>
      {users.map((user) => (
        <FilterButton key={user.id} active={selectedUserId === user.id} onClick={() => onChange(user.id)}>
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
      className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
        active ? 'bg-slate-700 text-white' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  );
}
