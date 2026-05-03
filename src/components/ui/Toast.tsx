import { useAppStore } from '../../store/useAppStore';

export function Toast() {
  const { toasts, removeToast } = useAppStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg
            border animate-slide-in-right min-w-[280px] max-w-sm
            ${toast.type === 'success'
              ? 'bg-white border-brand-200 text-brand-800 shadow-brand-100'
              : 'bg-white border-red-200 text-red-800 shadow-red-50'
            }
          `}
          role="alert"
        >
          <span className="shrink-0 text-lg">
            {toast.type === 'success' ? '✅' : '❌'}
          </span>
          <p className="text-sm font-medium flex-1">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="shrink-0 p-0.5 rounded opacity-50 hover:opacity-100 transition-opacity text-current"
            aria-label="Dismiss notification"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
