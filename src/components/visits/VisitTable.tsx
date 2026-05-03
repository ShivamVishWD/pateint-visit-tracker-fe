import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { getVisits, deleteVisit } from '../../api/visits';
import { useAppStore } from '../../store/useAppStore';
import { PageSpinner } from '../ui/Spinner';
import { EmptyState } from '../ui/EmptyState';
import type { VisitFilters } from '../../types';

const visitTypeBadge: Record<string, string> = {
  'General': 'bg-black-500/20 text-black-500',
  'Follow-up': 'bg-brand-500/20 text-brand-500',
  'Initial': 'bg-blue-500/20 text-blue-500',
  'Urgent': 'bg-red-500/20 text-red-500',
  'Routine': 'bg-purple-500/20 text-purple-500',
  'Specialist': 'bg-orange-500/20 text-orange-500',
  'Telehealth': 'bg-cyan-500/20 text-cyan-500',
};

interface VisitTableProps {
  filters: VisitFilters;
  onNewVisit: () => void;
}

export function VisitTable({ filters, onNewVisit }: VisitTableProps) {
  const queryClient = useQueryClient();
  const { addToast, showConfirm } = useAppStore();

  const { data: visits = [], isLoading } = useQuery({
    queryKey: ['visits', filters],
    queryFn: () => getVisits(filters),
    placeholderData: (prev) => prev,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteVisit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visits'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      addToast('Visit deleted.', 'success');
    },
    onError: () => addToast('Failed to delete visit.', 'error'),
  });

  const handleDelete = (id: number) => {
    showConfirm(
      'Delete Visit',
      'Are you sure you want to delete this visit record? This action cannot be undone.',
      () => deleteMutation.mutate(id)
    );
  };

  const formatDateTime = (dt: string | null) => {
    if (!dt) return '—';
    try {
      return format(parseISO(dt), "MMM d · h:mmaaa");
    } catch {
      return dt;
    }
  };

  return (
    <div className="card overflow-hidden">
      {/* Card header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold text-slate-200">Visit Log</h2>
          {visits.length > 0 && (
            <span className="px-2 py-0.5 text-xs font-semibold bg-brand-500/10 text-brand-400 rounded-full">
              {visits.length}
            </span>
          )}
        </div>
        <button
          id="btn-new-visit"
          onClick={onNewVisit}
          className="btn-primary text-xs px-3 py-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Visit
        </button>
      </div>

      {isLoading ? (
        <PageSpinner />
      ) : visits.length === 0 ? (
        <EmptyState
          icon="🗓️"
          title="No visits found"
          description="No visits match the selected filters."
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border bg-surface/50">
                <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Date & Time</th>
                <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Patient</th>
                <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Clinician</th>
                <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Type</th>
                <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Notes</th>
                <th className="px-6 py-3 text-right text-[10px] font-bold text-slate-500 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {visits.map((visit) => (
                <tr
                  key={visit.id}
                  className="hover:bg-surface-hover/50 transition-colors duration-100"
                >
                  <td className="px-6 py-4 text-slate-400 whitespace-nowrap font-mono text-xs">
                    {formatDateTime(visit.visitedAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-[10px] font-bold shrink-0">
                        {visit.patient?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-amber-500 font-medium">{visit.patient?.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 text-[10px] font-bold shrink-0">
                        {visit.clinician?.name?.split(' ').filter(n => !n.startsWith('Dr')).map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-brand-500">{visit.clinician?.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${visitTypeBadge[visit.visitType] ?? 'bg-slate-500/20 text-slate-300'}`}>
                      ● {visit.visitType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 max-w-[200px] truncate text-xs">
                    {visit.notes ?? <span className="italic">—</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(visit.id)}
                      disabled={deleteMutation.isPending}
                      className="btn-danger"
                      aria-label={`Delete visit ${visit.id}`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
