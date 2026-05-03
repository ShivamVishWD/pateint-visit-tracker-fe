import { useAppStore } from '../../store/useAppStore';

export function ConfirmDialog() {
  const { confirmDialog, hideConfirm } = useAppStore();

  if (!confirmDialog || !confirmDialog.isOpen) return null;

  const { title, message, onConfirm } = confirmDialog;

  const handleConfirm = () => {
    onConfirm();
    hideConfirm();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm animate-fade-in" 
        onClick={hideConfirm}
      />
      
      {/* Dialog */}
      <div className="relative bg-white w-full max-w-sm rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-surface-border animate-scale-in">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 text-red-500 shadow-sm shadow-red-100">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-8 whitespace-pre-line">
            {message}
          </p>
          
          <div className="flex gap-3 w-full">
            <button 
              onClick={hideConfirm}
              className="flex-1 px-4 py-3 rounded-2xl border border-surface-border text-sm font-semibold text-slate-600 hover:bg-surface transition-all active:scale-[0.98]"
            >
              Cancel
            </button>
            <button 
              onClick={handleConfirm}
              className="flex-1 px-4 py-3 rounded-2xl bg-red-500 text-white text-sm font-bold shadow-lg shadow-red-500/25 hover:bg-red-600 transition-all active:scale-[0.98]"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
