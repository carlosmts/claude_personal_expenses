import { useState, type ReactNode } from 'react';
import { MobileNav } from './MobileNav';
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
    <div className="flex min-h-screen bg-slate-50 dark:bg-gray-900">
      <Sidebar collapsed={collapsed} onToggleCollapsed={toggleCollapsed} />
      <main className="min-w-0 flex-1 overflow-x-auto px-4 pb-24 pt-[max(1rem,env(safe-area-inset-top))] md:px-8 md:pt-8 md:pb-8">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
