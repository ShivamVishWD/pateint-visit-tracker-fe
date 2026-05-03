import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteClinician } from '../../api/clinicians';
import { useAppStore } from '../../store/useAppStore';
import type { Clinician } from '../../types';

interface ClinicianCardProps {
  clinician: Clinician;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter((n) => !n.toLowerCase().startsWith('dr'))
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function ClinicianCard({ clinician }: ClinicianCardProps) {
  const queryClient = useQueryClient();
  const { addToast, showConfirm } = useAppStore();

  const deleteMutation = useMutation({
    mutationFn: () => deleteClinician(clinician.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinicians'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      addToast('Clinician removed.', 'success');
    },
    onError: () => addToast('Failed to remove clinician.', 'error'),
  });

  const handleDelete = () => {
    showConfirm(
      'Remove Clinician',
      `Are you sure you want to remove ${clinician.name} from the system?\n\nThis will not delete associated visits.`,
      () => deleteMutation.mutate()
    );
  };

  return (
    <div className="card p-5 flex flex-col gap-4 hover:bg-surface-hover transition-colors duration-200 group">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-11 h-11 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 text-sm font-bold shrink-0">
            {getInitials(clinician.name)}
          </div>
          <div>
            <p className="text-sm font-semibold text-brand-500 leading-tight">{clinician.name}</p>
            <p className="text-xs text-brand-400 mt-0.5">{clinician.specialty}</p>
          </div>
        </div>
        {/* Delete */}
        <button
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150 shrink-0"
          aria-label={`Remove ${clinician.name}`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Email */}
      <div className="flex items-center gap-2 text-slate-500">
        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
        <span className="text-xs truncate">{clinician.email}</span>
      </div>
    </div>
  );
}
