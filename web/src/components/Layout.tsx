import { useState, type ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

const COLLAPSED_STORAGE_KEY = 'sidebarCollapsed';

export function Layout({ children }: LayoutProps) {
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(COLLAPSED_STORAGE_KEY) === 'true');

  const toggleCollapsed = () => {
    setCollapsed((previous) => {
      const next = !previous;
      localStorage.setItem(COLLAPSED_STORAGE_KEY, String(next));
      return next;
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar collapsed={collapsed} onToggleCollapsed={toggleCollapsed} />
      <main className="min-w-0 flex-1 overflow-x-auto p-8">{children}</main>
    </div>
  );
}
