import { useAppStore } from '../../store/useAppStore';
import type { PageName } from '../../types';

interface NavItem {
  id: PageName;
  label: string;
  icon: React.ReactNode;
  section?: string;
}

const CalendarIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
  </svg>
);

const StethoscopeIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const navItems: NavItem[] = [
  { id: 'visits',     label: 'Visits',     icon: <CalendarIcon />,    section: 'RECORDS' },
  { id: 'clinicians', label: 'Clinicians', icon: <StethoscopeIcon />, section: 'PEOPLE' },
  { id: 'patients',   label: 'Patients',   icon: <UserIcon /> },
];

export function Sidebar() {
  const { activePage, setActivePage, logout } = useAppStore();

  return (
    <aside className="w-56 bg-white border-r border-surface-border flex flex-col shrink-0 py-4 shadow-sm">
      <div className="flex-1">
        {navItems.map((item, idx) => {
          const isActive = activePage === item.id;
          const prevSection = idx > 0 ? navItems[idx - 1].section : undefined;
          const isNewSection = item.section !== undefined && item.section !== prevSection;

          return (
            <div key={item.id}>
              {isNewSection && (
                <p className="px-4 pt-4 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {item.section}
                </p>
              )}
              <button
                id={`nav-${item.id}`}
                onClick={() => setActivePage(item.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium
                  transition-all duration-150 relative group
                  ${isActive
                    ? 'text-brand-700 bg-brand-50'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-surface'
                  }
                `}
              >
                {/* Active indicator */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 bg-brand-600 rounded-r" />
                )}
                <span className={isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            </div>
          );
        })}
      </div>

      <div className="px-4 pt-4 mt-auto border-t border-surface-border">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  );
}

