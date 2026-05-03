import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getClinicians } from '../../api/clinicians';
import { ClinicianCard } from './ClinicianCard';
import { AddClinicianModal } from './AddClinicianModal';
import { PageSpinner } from '../ui/Spinner';
import { EmptyState } from '../ui/EmptyState';

export function CliniciansPage() {
  const [showAdd, setShowAdd] = useState(false);

  const { data: clinicians = [], isLoading } = useQuery({
    queryKey: ['clinicians'],
    queryFn: getClinicians,
    staleTime: 60_000,
  });

  return (
    <div className="p-6 max-w-[1200px] mx-auto w-full">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-black-100">
            Staff Roster
            {clinicians.length > 0 && (
              <span className="ml-2 text-base font-normal text-gray-500">({clinicians.length})</span>
            )}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage your clinical staff</p>
        </div>
        <button
          id="btn-add-clinician"
          onClick={() => setShowAdd(true)}
          className="btn-primary"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Clinician
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <PageSpinner />
      ) : clinicians.length === 0 ? (
        <EmptyState icon="🩺" title="No clinicians yet" description="Add your first clinician to get started." />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
          {clinicians.map((c) => (
            <ClinicianCard key={c.id} clinician={c} />
          ))}
        </div>
      )}

      <AddClinicianModal open={showAdd} onClose={() => setShowAdd(false)} />
    </div>
  );
}
