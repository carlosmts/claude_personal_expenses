import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from './navItems';

/// Bottom tab bar shown only below the `md` breakpoint — the persistent
/// left Sidebar eats too much of a phone-width screen, so mobile gets the
/// same nav items as a fixed bottom bar instead (mirrors the native iOS
/// app's TabView).
export function MobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 flex border-t border-gray-100 bg-white pb-[env(safe-area-inset-bottom)] md:hidden dark:border-gray-800 dark:bg-gray-900">
      {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium ${
              isActive
                ? 'text-slate-900 dark:text-white'
                : 'text-gray-400 dark:text-gray-500'
            }`
          }
        >
          <Icon size={20} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
