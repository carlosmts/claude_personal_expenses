import { LayoutDashboard, Menu, PieChart, Receipt, Settings as SettingsIcon, Target } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/transactions', label: 'Transactions', icon: Receipt, end: false },
  { to: '/report', label: 'Report', icon: PieChart, end: false },
  { to: '/plan', label: 'Plan', icon: Target, end: false },
  { to: '/settings', label: 'Settings', icon: SettingsIcon, end: false },
];

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

export function Sidebar({ collapsed, onToggleCollapsed }: SidebarProps) {
  return (
    <nav
      className={`sticky top-0 flex h-screen shrink-0 flex-col bg-slate-600 py-6 text-white transition-all ${
        collapsed ? 'w-20 px-2' : 'w-60 px-4'
      }`}
    >
      <div className={`mb-8 flex items-center ${collapsed ? 'justify-center' : 'justify-between px-2'}`}>
        {!collapsed && <span className="truncate text-xl font-bold">Expense Tracker</span>}
        <button
          type="button"
          onClick={onToggleCollapsed}
          className="shrink-0 rounded-lg p-1.5 text-slate-200 hover:bg-white/10"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Menu size={20} />
        </button>
      </div>
      <ul className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                  collapsed ? 'justify-center' : ''
                } ${isActive ? 'bg-slate-800 text-white' : 'text-slate-200 hover:bg-white/10'}`
              }
            >
              <Icon size={18} />
              {!collapsed && label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
