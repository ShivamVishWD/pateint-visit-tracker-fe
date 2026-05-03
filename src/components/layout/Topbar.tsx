import { useAppStore } from '../../store/useAppStore';
import logo from '../../assets/logo.png';

export function Topbar() {
  const { user } = useAppStore();

  return (
    <header className="h-16 bg-white border-b border-surface-border flex items-center justify-between px-6 shrink-0 z-40 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 flex items-center justify-center">
          <img src={logo} alt="CareTrack Logo" className="w-full h-full object-contain" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-black-900 leading-tight tracking-tight">
            Patient Visit Tracker
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="h-8 w-[1px] bg-surface-border mx-2" />
        
        <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-surface transition-colors cursor-default group">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
              Administrator
            </span>
            <span className="text-sm font-semibold text-slate-700 leading-none">
              {user?.name || 'Admin'}
            </span>
          </div>
          
          <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 shadow-sm group-hover:bg-brand-100 group-hover:border-brand-200 transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
}
