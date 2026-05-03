import logo from '../../assets/logo.png';

export function Topbar() {
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
    </header>
  );
}
