'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Columns3, Plus } from 'lucide-react';
import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { useOpportunities } from '@/features/opportunities/hooks/use-opportunities';
import type { OpportunityStatus } from '@jobolo/shared';
import { getErrorMessage } from '@/features/opportunities/utils/opportunity.utils';
import { OpportunityGrid } from '@/features/opportunities/components/opportunity-list/opportunity-grid';
import { OpportunityPipeline } from '@/features/opportunities/components/opportunity-list/opportunity-pipeline';
import {
  getOpportunityFilters,
  OpportunityFiltersPanel,
} from '@/features/opportunities/components/opportunity-list/opportunity-filters';
import {
  OpportunitiesEmptyState,
  EmptyStageState,
} from '@/features/opportunities/components/opportunity-list/opportunity-list-states';

export default function OpportunitiesPage() {
  const [selectedStage, setSelectedStage] = useState<OpportunityStatus | 'all'>('all');
  const searchParams = useSearchParams();
  const { opportunities, isLoading, error, refetch } = useOpportunities(
    getOpportunityFilters(new URLSearchParams(searchParams.toString())),
  );

  const visibleOpportunities =
    selectedStage === 'all'
      ? opportunities
      : opportunities.filter((opportunity) => opportunity.stage === selectedStage);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-blue-600">
            Your job search memory
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Opportunities</h1>
          <p className="mt-2 text-slate-500">
            Keep every promising role and its context in one place.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/opportunities/kanban"
            className="inline-flex h-9 items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400"
          >
            <Columns3 className="mr-2 h-4 w-4" />
            Kanban view
          </Link>
          <Link
            href="/opportunities/create"
            className="inline-flex h-9 items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add opportunity
          </Link>
        </div>
      </header>

      {error && (
        <ErrorState
          message={getErrorMessage(error, 'We could not load your opportunities.')}
          onRetry={() => void refetch()}
        />
      )}

      {isLoading ? (
        <LoadingState variant="page" message="Loading opportunities..." />
      ) : opportunities.length === 0 ? (
        <OpportunitiesEmptyState />
      ) : (
        <>
          <OpportunityPipeline
            opportunities={opportunities}
            selectedStage={selectedStage}
            onSelectStage={setSelectedStage}
          />
          <OpportunityFiltersPanel key={searchParams.toString()} />
          {visibleOpportunities.length === 0 ? (
            <EmptyStageState onShowAll={() => setSelectedStage('all')} />
          ) : (
            <OpportunityGrid
              key={`${searchParams.toString()}-${selectedStage}`}
              opportunities={visibleOpportunities}
            />
          )}
        </>
      )}
    </div>
  );
}
