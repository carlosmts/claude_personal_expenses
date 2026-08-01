import { LayoutDashboard, PieChart, Receipt, Settings as SettingsIcon, Target } from 'lucide-react';

export const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/transactions', label: 'Transactions', icon: Receipt, end: false },
  { to: '/report', label: 'Report', icon: PieChart, end: false },
  { to: '/plan', label: 'Plan', icon: Target, end: false },
  { to: '/settings', label: 'Settings', icon: SettingsIcon, end: false },
];
