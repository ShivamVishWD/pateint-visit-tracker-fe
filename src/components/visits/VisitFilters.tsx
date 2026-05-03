import { useQuery } from '@tanstack/react-query';
import { getClinicians } from '../../api/clinicians';
import { getPatients } from '../../api/patients';
import type { VisitFilters } from '../../types';

interface VisitFiltersProps {
  filters: VisitFilters;
  onChange: (filters: VisitFilters) => void;
}

export function VisitFilters({ filters, onChange }: VisitFiltersProps) {
  const { data: clinicians = [] } = useQuery({
    queryKey: ['clinicians'],
    queryFn: getClinicians,
    staleTime: 60_000,
  });

  const { data: patients = [] } = useQuery({
    queryKey: ['patients'],
    queryFn: getPatients,
    staleTime: 60_000,
  });

  const hasFilter = !!(filters.clinicianId || filters.patientId);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Filter by</span>

      {/* Clinician filter */}
      <select
        id="filter-clinician"
        className="form-select w-auto text-xs py-2 pr-8"
        value={filters.clinicianId ?? ''}
        onChange={(e) =>
          onChange({ ...filters, clinicianId: e.target.value ? Number(e.target.value) : undefined })
        }
      >
        <option value="">All Clinicians</option>
        {clinicians.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      {/* Patient filter */}
      <select
        id="filter-patient"
        className="form-select w-auto text-xs py-2 pr-8"
        value={filters.patientId ?? ''}
        onChange={(e) =>
          onChange({ ...filters, patientId: e.target.value ? Number(e.target.value) : undefined })
        }
      >
        <option value="">All Patients</option>
        {patients.map((p) => (
          <option key={p.id} value={p.id}>{p.name} · {p.contactNumber}</option>
        ))}
      </select>

      {/* Clear button */}
      {hasFilter && (
        <button
          id="filter-clear"
          onClick={() => onChange({})}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 
                     px-3 py-2 rounded-lg bg-surface-hover hover:bg-surface-border transition-colors"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear
        </button>
      )}
    </div>
  );
}
