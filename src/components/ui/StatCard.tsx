interface StatCardProps {
  label: string;
  value: number | string;
  color: 'green' | 'amber' | 'blue';
  icon: string;
  onClick?: () => void;
}

const colorMap = {
  green: {
    border:  'border-t-brand-500',
    iconBg:  'bg-brand-50',
    iconTxt: 'text-brand-600',
    value:   'text-brand-700',
  },
  amber: {
    border:  'border-t-amber-500',
    iconBg:  'bg-amber-50',
    iconTxt: 'text-amber-600',
    value:   'text-amber-700',
  },
  blue: {
    border:  'border-t-blue-500',
    iconBg:  'bg-blue-50',
    iconTxt: 'text-blue-600',
    value:   'text-blue-700',
  },
};

export function StatCard({ label, value, color, icon, onClick }: StatCardProps) {
  const c = colorMap[color];
  const clickableClass = onClick ? 'cursor-pointer hover:shadow-lg hover:-translate-y-0.5' : '';
  
  return (
    <div 
      className={`card border-t-2 ${c.border} p-5 flex items-center gap-4 transition-all duration-200 hover:shadow-md ${clickableClass}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${c.iconBg} ${c.iconTxt}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-0.5">
          {label}
        </p>
        <p className={`text-3xl font-bold ${c.value}`}>{value}</p>
      </div>
    </div>
  );
}
