import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format, parseISO, differenceInYears } from 'date-fns';
import { deletePatient } from '../../api/patients';
import { useAppStore } from '../../store/useAppStore';
import type { Patient } from '../../types';

interface PatientCardProps {
  patient: Patient;
}

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

function formatDob(dateOfBirth: string) {
  try {
    const date = parseISO(dateOfBirth);
    const age = differenceInYears(new Date(), date);
    return `${format(date, 'MMM d, yyyy')} · ${age}y`;
  } catch {
    return dateOfBirth;
  }
}

export function PatientCard({ patient }: PatientCardProps) {
  const queryClient = useQueryClient();
  const { addToast, showConfirm } = useAppStore();

  const deleteMutation = useMutation({
    mutationFn: () => deletePatient(patient.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      addToast('Patient removed.', 'success');
    },
    onError: () => addToast('Failed to remove patient.', 'error'),
  });

  const handleDelete = () => {
    showConfirm(
      'Remove Patient',
      `Are you sure you want to remove ${patient.name} from the registry?\n\nThis will not delete associated visits.`,
      () => deleteMutation.mutate()
    );
  };

  return (
    <div className="card p-5 flex flex-col gap-4 hover:bg-surface-hover transition-colors duration-200 group">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Avatar — amber for patients */}
          <div className="w-11 h-11 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-sm font-bold shrink-0">
            {getInitials(patient.name)}
          </div>
          <div>
            <p className="text-sm font-semibold text-amber-500 leading-tight">{patient.name}</p>
            <p className="text-xs text-amber-400/80 mt-0.5 font-mono">{patient.contactNumber}</p>
          </div>
        </div>
        {/* Delete */}
        <button
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150 shrink-0"
          aria-label={`Remove ${patient.name}`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* DOB + age */}
      <div className="flex items-center gap-2 text-slate-500">
        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
        </svg>
        <span className="text-xs">DOB: {formatDob(patient.dateOfBirth)}</span>
      </div>
    </div>
  );
}
