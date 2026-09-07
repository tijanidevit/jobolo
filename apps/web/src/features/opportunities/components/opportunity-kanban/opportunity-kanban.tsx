'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, GripVertical } from 'lucide-react';
import type { OpportunityStatus } from '@jobolo/shared';
import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { useChangeOpportunityStage } from '../../hooks/use-change-opportunity-stage';
import { useOpportunities } from '../../hooks/use-opportunities';
import { OPPORTUNITY_STAGES, getStageLabel } from '../../constants';
import type { Opportunity } from '../../types';
import { getErrorMessage } from '../../utils/opportunity.utils';

export function OpportunityKanban() {
  const { opportunities, isLoading, error, refetch } = useOpportunities();
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropStage, setDropStage] = useState<OpportunityStatus | null>(null);
  const { changeStage, isChangingStage } = useChangeOpportunityStage();

  const moveOpportunity = async (opportunity: Opportunity, stage: OpportunityStatus) => {
    if (stage === opportunity.stage) return;
    await changeStage({ id: opportunity.id, stage }).catch(() => undefined);
  };

  const handleDrop = async (stage: OpportunityStatus) => {
    const opportunity = opportunities.find((item) => item.id === draggingId);
    setDraggingId(null);
    setDropStage(null);
    if (opportunity) await moveOpportunity(opportunity, stage);
  };

  if (isLoading) return <LoadingState variant="page" message="Loading pipeline board..." />;
  if (error) return <ErrorState message={getErrorMessage(error, 'We could not load your pipeline.')} onRetry={() => void refetch()} />;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div><p className="text-sm text-slate-500">Drag cards between stages or use the stage selector on each card.</p><p className="mt-1 text-xs text-slate-400">{opportunities.length} opportunities in your pipeline</p></div>
        {isChangingStage && <span className="text-xs font-medium text-blue-600">Saving stage change...</span>}
      </div>
      <div className="-mx-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6"><div className="flex min-h-[32rem] gap-4">
        {OPPORTUNITY_STAGES.map((stage) => {
          const stageOpportunities = opportunities.filter((opportunity) => opportunity.stage === stage.value);
          const isDropTarget = dropStage === stage.value;
          return (
            <section key={stage.value} aria-label={`${stage.label} opportunities`} onDragOver={(event) => { event.preventDefault(); setDropStage(stage.value); }} onDragLeave={() => setDropStage((current) => (current === stage.value ? null : current))} onDrop={(event) => { event.preventDefault(); void handleDrop(stage.value); }} className={`flex w-72 shrink-0 flex-col rounded-xl border p-3 transition-colors ${isDropTarget ? 'border-blue-400 bg-blue-50/70' : 'border-slate-200 bg-slate-50/80'}`}>
              <div className="mb-3 flex items-center justify-between gap-2 border-b border-slate-200 pb-3"><h2 className="text-sm font-semibold text-slate-800">{stage.label}</h2><span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-slate-500">{stageOpportunities.length}</span></div>
              <div className="flex flex-1 flex-col gap-3">
                {stageOpportunities.map((opportunity) => <KanbanCard key={opportunity.id} opportunity={opportunity} isDragging={draggingId === opportunity.id} onDragStart={() => setDraggingId(opportunity.id)} onDragEnd={() => { setDraggingId(null); setDropStage(null); }} onStageChange={(nextStage) => void moveOpportunity(opportunity, nextStage)} />)}
                {stageOpportunities.length === 0 && <div className="flex min-h-24 flex-1 items-center justify-center rounded-lg border border-dashed border-slate-200 px-3 text-center text-xs text-slate-400">Drop an opportunity here</div>}
              </div>
            </section>
          );
        })}
      </div></div>
    </div>
  );
}

function KanbanCard({ opportunity, isDragging, onDragStart, onDragEnd, onStageChange }: { opportunity: Opportunity; isDragging: boolean; onDragStart: () => void; onDragEnd: () => void; onStageChange: (stage: OpportunityStatus) => void }) {
  return (
    <article draggable onDragStart={onDragStart} onDragEnd={onDragEnd} className={`flex h-56 flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md ${isDragging ? 'cursor-grabbing opacity-50' : 'cursor-grab'}`}>
      <div className="flex items-start gap-2"><GripVertical className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" aria-hidden="true" /><div className="min-w-0 flex-1"><Link href={`/opportunities/${opportunity.id}`} className="block truncate text-sm font-semibold text-slate-900 hover:text-blue-600">{opportunity.jobTitle}</Link><p className="mt-1 truncate text-xs font-medium text-slate-500">{opportunity.companyName}</p></div></div>
      {(opportunity.location || opportunity.workArrangement) && <p className="mt-3 truncate text-xs text-slate-500">{[opportunity.location, opportunity.workArrangement].filter(Boolean).join(' · ')}</p>}
      {opportunity.nextAction && <p className="mt-3 line-clamp-2 text-xs font-medium text-blue-700">Next: {opportunity.nextAction}</p>}
      <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-100 pt-3"><label className="sr-only" htmlFor={`kanban-stage-${opportunity.id}`}>Move {opportunity.jobTitle} to stage</label><div className="min-w-0 flex-1"><SearchableSelect value={opportunity.stage} options={OPPORTUNITY_STAGES} onChange={(value) => onStageChange(value as OpportunityStatus)} placeholder={getStageLabel(opportunity.stage)} searchPlaceholder="Search stages..." /></div><Link href={`/opportunities/${opportunity.id}`} className="inline-flex shrink-0 items-center text-xs font-medium text-blue-600 hover:underline">Open <ArrowRight className="ml-1 h-3 w-3" /></Link></div>
    </article>
  );
}
