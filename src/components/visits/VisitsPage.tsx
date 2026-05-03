import { useState } from 'react';
import { StatsRow } from './StatsRow';
import { VisitFilters } from './VisitFilters';
import { VisitTable } from './VisitTable';
import { NewVisitModal } from './NewVisitModal';
import type { VisitFilters as VisitFiltersType } from '../../types';

export function VisitsPage() {
  const [filters, setFilters] = useState<VisitFiltersType>({});
  const [showNewVisit, setShowNewVisit] = useState(false);

  return (
    <div className="p-6 max-w-[1200px] mx-auto w-full">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-black-100">Visits</h1>
        <p className="text-sm text-gray-500 mt-0.5">Track and manage all patient visits</p>
      </div>

      {/* Stats */}
      <StatsRow />

      {/* Filters row */}
      <div className="mb-4">
        <VisitFilters filters={filters} onChange={setFilters} />
      </div>

      {/* Visit log */}
      <VisitTable filters={filters} onNewVisit={() => setShowNewVisit(true)} />

      {/* Modal */}
      <NewVisitModal open={showNewVisit} onClose={() => setShowNewVisit(false)} />
    </div>
  );
}
