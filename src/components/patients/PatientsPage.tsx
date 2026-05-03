import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPatients } from '../../api/patients';
import { PatientCard } from './PatientCard';
import { RegisterPatientModal } from './RegisterPatientModal';
import { PageSpinner } from '../ui/Spinner';
import { EmptyState } from '../ui/EmptyState';

export function PatientsPage() {
  const [showRegister, setShowRegister] = useState(false);

  const { data: patients = [], isLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: getPatients,
    staleTime: 60_000,
  });

  return (
    <div className="p-6 max-w-[1200px] mx-auto w-full">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-black-100">
            Patient Registry
            {patients.length > 0 && (
              <span className="ml-2 text-base font-normal text-gray-500">({patients.length})</span>
            )}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Registered patients in the system</p>
        </div>
        <button
          id="btn-register-patient"
          onClick={() => setShowRegister(true)}
          className="btn-primary"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Register Patient
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <PageSpinner />
      ) : patients.length === 0 ? (
        <EmptyState icon="👤" title="No patients yet" description="Register your first patient to get started." />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
          {patients.map((p) => (
            <PatientCard key={p.id} patient={p} />
          ))}
        </div>
      )}

      <RegisterPatientModal open={showRegister} onClose={() => setShowRegister(false)} />
    </div>
  );
}
