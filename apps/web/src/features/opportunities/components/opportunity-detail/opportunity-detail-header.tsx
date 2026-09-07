'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BriefcaseBusiness, CalendarClock, CalendarDays, MapPin, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { useChangeOpportunityStage } from '../../hooks/use-change-opportunity-stage';
import { useDeleteOpportunity } from '../../hooks/use-delete-opportunity';
import type { Opportunity } from '../../types';
import { formatDate, formatValue } from '../../utils/opportunity.utils';
import { OPPORTUNITY_STAGES } from '../../constants';

function isOverdue(value: string | null) {
  return value !== null && new Date(value).getTime() < Date.now();
}

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

          <div className="flex flex-col items-stretch gap-3 lg:items-end">
            <div className="flex flex-wrap items-center gap-2 lg:justify-end">
            <div className="min-w-44">
              <SearchableSelect
                value={opportunity.stage}
                options={OPPORTUNITY_STAGES}
                disabled={isChangingStage}
                onChange={(stage) =>
                  void changeStage({
                    id: opportunity.id,
                    stage: stage as Opportunity['stage'],
                  })
                }
                placeholder="Select stage"
                searchPlaceholder="Search stages..."
              />
            </div>
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
            <div className="w-full max-w-sm rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-3 text-left">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-600">
                Next action
              </p>
              {opportunity.nextAction ? (
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <p className="text-sm font-semibold text-slate-900">{opportunity.nextAction}</p>
                  {opportunity.nextActionDueDate && (
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs ${
                        isOverdue(opportunity.nextActionDueDate)
                          ? 'font-medium text-red-600'
                          : 'text-slate-500'
                      }`}
                    >
                      <CalendarClock className="h-3.5 w-3.5" />
                      {isOverdue(opportunity.nextActionDueDate) ? 'Overdue · ' : ''}
                      {formatDate(opportunity.nextActionDueDate)}
                    </span>
                  )}
                </div>
              ) : (
                <p className="mt-1 text-sm text-slate-500">No next action set</p>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
