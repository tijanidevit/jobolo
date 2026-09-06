'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, BriefcaseBusiness, ExternalLink, MapPin, Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { getStageLabel } from '../constants';
import { useOpportunities } from '../hooks/use-opportunities';
import type { Opportunity, OpportunityPayload } from '../types';
import { OpportunityForm } from './opportunity-form';

function getErrorMessage(error: unknown, fallback: string) {
  const message = (error as { response?: { data?: { message?: unknown } } }).response?.data?.message;
  return typeof message === 'string' ? message : fallback;
}

function formatDate(value: string | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
}

function formatScore(value: number | null, label: string) {
  return value === null ? null : `${label} ${value}%`;
}

export function OpportunitiesScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);
  const [isCreating, setIsCreating] = useState(searchParams.get('create') === '1');
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const {
    opportunities,
    isLoading,
    error,
    refetch,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity,
    isCreating: isSaving,
    isUpdating,
    isDeleting,
  } = useOpportunities();

  const closeForm = () => {
    setEditingOpportunity(null);
    setIsCreating(false);
    setFormError(null);
    router.replace('/opportunities');
  };

  const saveOpportunity = async (payload: OpportunityPayload) => {
    try {
      setFormError(null);
      if (editingOpportunity) {
        await updateOpportunity({ id: editingOpportunity.id, payload });
      } else {
        await createOpportunity(payload);
      }
      closeForm();
    } catch (saveError: unknown) {
      setFormError(getErrorMessage(saveError, 'We could not save this opportunity. Please try again.'));
    }
  };

  const removeOpportunity = async (opportunity: Opportunity) => {
    if (!window.confirm(`Delete ${opportunity.jobTitle} at ${opportunity.companyName}?`)) return;
    try {
      setDeletingId(opportunity.id);
      await deleteOpportunity(opportunity.id);
    } catch (deleteError: unknown) {
      setFormError(getErrorMessage(deleteError, 'We could not delete this opportunity. Please try again.'));
    } finally {
      setDeletingId(null);
    }
  };

  if (isCreating || editingOpportunity) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <OpportunityForm
          opportunity={editingOpportunity}
          isSaving={isSaving || isUpdating}
          onSubmit={saveOpportunity}
          onCancel={closeForm}
        />
        {formError && <ErrorBanner message={formError} />}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-blue-600">Your job search memory</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Opportunities</h1>
          <p className="mt-2 text-slate-500">Keep every promising role and its context in one place.</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add opportunity
        </Button>
      </header>

      {error && (
        <Card className="border-red-100 bg-red-50">
          <CardContent className="flex items-center justify-between gap-4 p-4 text-sm text-red-700">
            <span className="flex items-center gap-2"><AlertCircle className="h-4 w-4 shrink-0" />{getErrorMessage(error, 'We could not load your opportunities.')}</span>
            <Button variant="outline" size="sm" onClick={() => void refetch()}>Try again</Button>
          </CardContent>
        </Card>
      )}
      {formError && <ErrorBanner message={formError} />}

      {isLoading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" aria-label="Loading opportunities">
          {[1, 2, 3].map((item) => <div key={item} className="h-64 animate-pulse rounded-xl border border-slate-200 bg-white" />)}
        </div>
      ) : opportunities.length === 0 ? (
        <EmptyState onCreate={() => setIsCreating(true)} />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {opportunities.map((opportunity) => (
            <OpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              isDeleting={isDeleting && deletingId === opportunity.id}
              onEdit={() => setEditingOpportunity(opportunity)}
              onDelete={() => void removeOpportunity(opportunity)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function OpportunityCard({
  opportunity,
  isDeleting,
  onEdit,
  onDelete,
}: {
  opportunity: Opportunity;
  isDeleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const scores = [
    formatScore(opportunity.fitScore, 'Fit'),
    formatScore(opportunity.interestScore, 'Interest'),
    formatScore(opportunity.confidenceScore, 'Confidence'),
  ].filter(Boolean);

  return (
    <Card className="flex flex-col transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="truncate text-lg">{opportunity.jobTitle}</CardTitle>
            <CardDescription className="mt-1 truncate text-sm font-medium text-slate-700">{opportunity.companyName}</CardDescription>
          </div>
          <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
            {getStageLabel(opportunity.stage)}
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-5">
        <div className="space-y-2 text-sm text-slate-500">
          {(opportunity.location || opportunity.workArrangement) && (
            <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-slate-400" />{[opportunity.location, opportunity.workArrangement].filter(Boolean).join(' · ')}</p>
          )}
          {opportunity.dateApplied && <p>Applied {formatDate(opportunity.dateApplied)}</p>}
          {opportunity.priority && <p className={cn('font-medium', opportunity.priority === 'high' ? 'text-amber-700' : 'text-slate-600')}>{opportunity.priority[0].toUpperCase() + opportunity.priority.slice(1)} priority</p>}
        </div>
        {scores.length > 0 && <div className="flex flex-wrap gap-2">{scores.map((score) => <span key={score} className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">{score}</span>)}</div>}
        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
          {opportunity.jobUrl ? <a href={opportunity.jobUrl} target="_blank" rel="noreferrer" className="inline-flex items-center text-xs font-medium text-blue-600 hover:underline">View posting <ExternalLink className="ml-1 h-3 w-3" /></a> : <span />}
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={onEdit} aria-label={`Edit ${opportunity.jobTitle}`}><Pencil className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" onClick={onDelete} disabled={isDeleting} aria-label={`Delete ${opportunity.jobTitle}`}><Trash2 className="h-4 w-4 text-red-500" /></Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"><BriefcaseBusiness className="h-7 w-7" /></div>
        <h2 className="mt-5 text-xl font-semibold text-slate-900">Start building your job-search memory</h2>
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">Save a role as soon as you discover it. You can add more application details later.</p>
        <Button className="mt-6" onClick={onCreate}><Plus className="mr-2 h-4 w-4" />Add your first opportunity</Button>
      </CardContent>
    </Card>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return <div className="mt-4 flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-700" role="alert"><AlertCircle className="h-4 w-4 shrink-0" />{message}</div>;
}
