'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BriefcaseBusiness, CalendarDays, MapPin, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChangeOpportunityStage } from '../../hooks/use-change-opportunity-stage';
import { useDeleteOpportunity } from '../../hooks/use-delete-opportunity';
import type { Opportunity } from '../../types';
import { formatDate, formatValue } from '../../utils/opportunity.utils';
import { OPPORTUNITY_STAGES } from '../../constants';

export function OpportunityDetailHeader({ opportunity }: { opportunity: Opportunity }) {
  const router = useRouter();
  const { deleteOpportunity, isDeleting } = useDeleteOpportunity();
  const { changeStage, isChangingStage } = useChangeOpportunityStage();

  const removeOpportunity = async () => {
    if (!window.confirm(`Delete ${opportunity.jobTitle} at ${opportunity.companyName}?`)) return;
    await deleteOpportunity(opportunity.id)
      .then(() => router.replace('/opportunities'))
      .catch(() => undefined);
  };

  return (
    <>
      <Link
        href="/opportunities"
        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        All opportunities
      </Link>

      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex gap-4">
            <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 sm:flex">
              <BriefcaseBusiness className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.14em] text-blue-600">
                Opportunity details
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                {opportunity.jobTitle}
              </h1>
              <p className="mt-2 text-lg text-slate-600">{opportunity.companyName}</p>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500">
                {(opportunity.location || opportunity.workArrangement) && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {[opportunity.location, formatValue(opportunity.workArrangement)]
                      .filter(Boolean)
                      .join(' · ')}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" />
                  Updated {formatDate(opportunity.updatedAt)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 lg:justify-end">
            <select
              aria-label="Opportunity stage"
              value={opportunity.stage}
              disabled={isChangingStage}
              onChange={(event) =>
                void changeStage({
                  id: opportunity.id,
                  stage: event.target.value as Opportunity['stage'],
                })
              }
              className="h-9 rounded-full border border-blue-100 bg-blue-50 px-3 text-sm font-semibold text-blue-700 outline-none focus:ring-2 focus:ring-blue-200"
            >
              {OPPORTUNITY_STAGES.map((stage) => (
                <option key={stage.value} value={stage.value}>
                  {stage.label}
                </option>
              ))}
            </select>
            <Link
              href={`/opportunities/${opportunity.id}/edit`}
              className="inline-flex h-8 items-center rounded-md border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-100"
            >
              <Pencil className="mr-2 h-3.5 w-3.5" />
              Edit
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => void removeOpportunity()}
              disabled={isDeleting}
              aria-label="Delete opportunity"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      </header>
    </>
  );
}
