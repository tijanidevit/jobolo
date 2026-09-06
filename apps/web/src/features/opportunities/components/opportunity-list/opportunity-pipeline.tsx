'use client';

import { OPPORTUNITY_STAGES } from '../../constants';
import type { Opportunity } from '../../types';
import type { OpportunityStatus } from '@jobolo/shared';
import { cn } from '@/lib/utils';

const ACTIVE_STAGES = new Set<OpportunityStatus>([
  'discovered',
  'interested',
  'applied',
  'recruiter_contact',
  'screening',
  'interview',
  'final_round',
  'offer',
]);
const INTERVIEW_STAGES = new Set<OpportunityStatus>(['interview', 'final_round']);
const CLOSED_STAGES = new Set<OpportunityStatus>([
  'accepted',
  'declined',
  'rejected',
  'withdrawn',
  'ghosted',
  'expired',
]);

interface OpportunityPipelineProps {
  opportunities: Opportunity[];
  selectedStage: OpportunityStatus | 'all';
  onSelectStage: (stage: OpportunityStatus | 'all') => void;
}

export function OpportunityPipeline({
  opportunities,
  selectedStage,
  onSelectStage,
}: OpportunityPipelineProps) {
  const countWhere = (stages: Set<OpportunityStatus>) =>
    opportunities.filter((opportunity) => stages.has(opportunity.stage)).length;
  const countStage = (stage: OpportunityStatus) =>
    opportunities.filter((opportunity) => opportunity.stage === stage).length;

  return (
    <section
      aria-labelledby="pipeline-heading"
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-600" aria-hidden="true" />
            <h2 id="pipeline-heading" className="text-lg font-semibold text-slate-900">
              Your pipeline
            </h2>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            A quick view of where your opportunities stand.
          </p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-2xl font-semibold tracking-tight text-slate-900">
            {opportunities.length}
          </p>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Total opportunities
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 py-5 sm:grid-cols-3 lg:grid-cols-6">
        <PipelineMetric label="Active" value={countWhere(ACTIVE_STAGES)} tone="blue" />
        <PipelineMetric label="Applied" value={countStage('applied')} />
        <PipelineMetric label="Interviews" value={countWhere(INTERVIEW_STAGES)} />
        <PipelineMetric label="Offers" value={countStage('offer')} tone="amber" />
        <PipelineMetric label="Closed" value={countWhere(CLOSED_STAGES)} />
        <PipelineMetric label="Interested" value={countStage('interested')} />
      </div>
      <div className="flex flex-col gap-2 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <label htmlFor="pipeline-stage-filter" className="text-sm font-semibold text-slate-700">
            Filter by stage
          </label>
          <p className="text-xs text-slate-400">Choose a specific point in the lifecycle.</p>
        </div>
        <select
          id="pipeline-stage-filter"
          value={selectedStage}
          onChange={(event) => onSelectStage(event.target.value as OpportunityStatus | 'all')}
          className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 sm:w-64"
        >
          <option value="all">All stages ({opportunities.length})</option>
          {OPPORTUNITY_STAGES.map((stage) => (
            <option key={stage.value} value={stage.value}>
              {stage.label} ({countStage(stage.value)})
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}

function PipelineMetric({
  label,
  value,
  tone = 'slate',
}: {
  label: string;
  value: number;
  tone?: 'blue' | 'amber' | 'slate';
}) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-3">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p
        className={cn(
          'mt-1 text-xl font-semibold',
          tone === 'blue' && 'text-blue-600',
          tone === 'amber' && 'text-amber-600',
          tone === 'slate' && 'text-slate-900',
        )}
      >
        {value}
      </p>
    </div>
  );
}
