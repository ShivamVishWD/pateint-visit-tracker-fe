import { useQuery } from '@tanstack/react-query';
import { StatCard } from '../ui/StatCard';
import { getStats } from '../../api/visits';
import { useAppStore } from '../../store/useAppStore';

export function StatsRow() {
  const setActivePage = useAppStore(s => s.setActivePage);
  const { data, isLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: getStats,
    staleTime: 30_000,
  });

  const visits    = isLoading ? '—' : (data?.total_visits    ?? 0);
  const clinicians = isLoading ? '—' : (data?.total_clinicians ?? 0);
  const patients  = isLoading ? '—' : (data?.total_patients  ?? 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <StatCard label="Total Visits"  value={visits}     color="green" icon="🗓" onClick={() => setActivePage('visits')} />
      <StatCard label="Clinicians"    value={clinicians} color="amber" icon="🩺" onClick={() => setActivePage('clinicians')} />
      <StatCard label="Patients"      value={patients}   color="blue"  icon="👤" onClick={() => setActivePage('patients')} />
    </div>
  );
}
