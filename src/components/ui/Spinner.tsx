interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`inline-block ${sizeMap[size]} border-2 border-surface-border border-t-brand-500 rounded-full animate-spin ${className}`}
    />
  );
}

export function PageSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <Spinner size="lg" />
      <p className="text-sm text-slate-400">Loading…</p>
    </div>
  );
}
