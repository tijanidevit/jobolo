'use client';

import Link from 'next/link';
import { ArrowRight, ExternalLink, MapPin, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { getStageLabel, OPPORTUNITY_STAGES } from '../../constants';
import type { Opportunity } from '../../types';
import type { OpportunityStatus } from '@jobolo/shared';
import { formatDate } from '../../utils/opportunity.utils';
import { useDeleteOpportunity } from '../../hooks/use-delete-opportunity';
import { useChangeOpportunityStage } from '../../hooks/use-change-opportunity-stage';
import { SearchableSelect } from '@/components/ui/searchable-select';

interface OpportunityCardProps {
  opportunity: Opportunity;
}

function formatScore(value: number | null, label: string) {
  return value === null ? null : `${label} ${value}%`;
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const { deleteOpportunity, isDeleting } = useDeleteOpportunity();
  const { changeStage, isChangingStage } = useChangeOpportunityStage();
  const scores = [
    formatScore(opportunity.fitScore, 'Fit'),
    formatScore(opportunity.interestScore, 'Interest'),
    formatScore(opportunity.confidenceScore, 'Confidence'),
  ].filter(Boolean);

  const removeOpportunity = async () => {
    if (!window.confirm(`Delete ${opportunity.jobTitle} at ${opportunity.companyName}?`)) return;
    await deleteOpportunity(opportunity.id).catch(() => undefined);
  };

  const updateStage = async (stage: OpportunityStatus) => {
    if (stage === opportunity.stage) return;
    await changeStage({ id: opportunity.id, stage }).catch(() => undefined);
  };

  return (
    <Card className="flex flex-col transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="truncate text-lg">{opportunity.jobTitle}</CardTitle>
            <CardDescription className="mt-1 truncate text-sm font-medium text-slate-700">
              {opportunity.companyName}
            </CardDescription>
          </div>
          <label className="sr-only" htmlFor={`stage-${opportunity.id}`}>
            Stage for {opportunity.jobTitle}
          </label>
          <div className="max-w-36">
            <SearchableSelect
              value={opportunity.stage}
              options={OPPORTUNITY_STAGES}
              onChange={(value) => void updateStage(value as OpportunityStatus)}
              disabled={isChangingStage}
              placeholder={getStageLabel(opportunity.stage)}
              searchPlaceholder="Search stages..."
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-5">
        <div className="space-y-2 text-sm text-slate-500">
          {(opportunity.location || opportunity.workArrangement) && (
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-slate-400" />
              {[opportunity.location, opportunity.workArrangement].filter(Boolean).join(' · ')}
            </p>
          )}
          {opportunity.dateApplied && <p>Applied {formatDate(opportunity.dateApplied)}</p>}
          {opportunity.priority && (
            <p
              className={cn(
                'font-medium',
                opportunity.priority === 'high' ? 'text-amber-700' : 'text-slate-600',
              )}
            >
              {opportunity.priority[0].toUpperCase() + opportunity.priority.slice(1)} priority
            </p>
          )}
        </div>
        {scores.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {scores.map((score) => (
              <span
                key={score}
                className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600"
              >
                {score}
              </span>
            ))}
          </div>
        )}
        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
          {opportunity.jobUrl ? (
            <a
              href={opportunity.jobUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center text-xs font-medium text-blue-600 hover:underline"
            >
              View posting <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          ) : (
            <span />
          )}
          <div className="flex gap-1">
            <Link
              href={`/opportunities/${opportunity.id}`}
              className="inline-flex h-8 items-center gap-1 rounded-md px-3 text-xs font-medium text-blue-600 transition-colors hover:bg-slate-100"
            >
              View details <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href={`/opportunities/${opportunity.id}/edit`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400"
              aria-label={`Edit ${opportunity.jobTitle}`}
            >
              <Pencil className="h-4 w-4" />
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => void removeOpportunity()}
              disabled={isDeleting}
              aria-label={`Delete ${opportunity.jobTitle}`}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
