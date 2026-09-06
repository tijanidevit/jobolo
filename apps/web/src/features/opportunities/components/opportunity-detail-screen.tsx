'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { AlertCircle, ArrowLeft, BriefcaseBusiness, CalendarDays, ExternalLink, MapPin, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { OPPORTUNITY_STAGES, getStageLabel } from '../constants';
import { useOpportunity } from '../hooks/use-opportunity';
import type { Opportunity } from '../types';
import { OpportunityTimeline } from './opportunity-timeline';

function getErrorMessage(error: unknown, fallback: string) {
  const message = (error as { response?: { data?: { message?: unknown } } }).response?.data?.message;
  return typeof message === 'string' ? message : fallback;
}

function formatDate(value: string | null) {
  if (!value) return 'Not added';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Not added' : new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
}

function formatValue(value: unknown) {
  if (value === null || value === undefined || value === '') return 'Not added';
  return String(value).replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatMoney(value: number | null, currency: string | null) {
  if (value === null || value === undefined) return 'Not added';
  const amount = Number(value);
  if (Number.isNaN(amount)) return 'Not added';
  return new Intl.NumberFormat('en', { style: 'currency', currency: currency || 'USD', maximumFractionDigits: 0 }).format(amount);
}

function DetailField({ label, value, wide = false }: { label: string; value: ReactNode; wide?: boolean }) {
  return <div className={cn(wide && 'sm:col-span-2')}><dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</dt><dd className="mt-1 text-sm font-medium text-slate-800">{value}</dd></div>;
}

function DetailSection({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return <Card><CardHeader className="border-b border-slate-100 pb-4"><CardTitle className="text-base">{title}</CardTitle>{description && <CardDescription>{description}</CardDescription>}</CardHeader><CardContent className="pt-5"><dl className="grid gap-x-6 gap-y-5 sm:grid-cols-2">{children}</dl></CardContent></Card>;
}

export function OpportunityDetailScreen() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { opportunity, isLoading, error, refetch, deleteOpportunity, changeStage, isDeleting, isChangingStage } = useOpportunity(id);

  const removeOpportunity = async () => {
    if (!opportunity || !window.confirm(`Delete ${opportunity.jobTitle} at ${opportunity.companyName}?`)) return;
    try {
      setErrorMessage(null);
      await deleteOpportunity();
      router.replace('/opportunities');
    } catch (deleteError: unknown) {
      setErrorMessage(getErrorMessage(deleteError, 'We could not delete this opportunity. Please try again.'));
    }
  };

  if (isLoading) return <DetailLoading />;
  if (error || !opportunity) return <DetailError message={getErrorMessage(error, 'This opportunity could not be found.')} onRetry={() => void refetch()} />;
  return <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
    <Link href="/opportunities" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600"><ArrowLeft className="mr-2 h-4 w-4" />All opportunities</Link>
    {errorMessage && <ErrorBanner message={errorMessage} />}
    <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex gap-4"><div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 sm:flex"><BriefcaseBusiness className="h-6 w-6" /></div><div><p className="text-sm font-medium uppercase tracking-[0.14em] text-blue-600">Opportunity details</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{opportunity.jobTitle}</h1><p className="mt-2 text-lg text-slate-600">{opportunity.companyName}</p><div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500">{(opportunity.location || opportunity.workArrangement) && <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" />{[opportunity.location, formatValue(opportunity.workArrangement)].filter(Boolean).join(' · ')}</span>}<span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4" />Updated {formatDate(opportunity.updatedAt)}</span></div></div></div>
        <div className="flex flex-wrap items-center gap-2 lg:justify-end"><select aria-label="Opportunity stage" value={opportunity.stage} disabled={isChangingStage} onChange={(event) => void changeStage(event.target.value as Opportunity['stage'])} className="h-9 rounded-full border border-blue-100 bg-blue-50 px-3 text-sm font-semibold text-blue-700 outline-none focus:ring-2 focus:ring-blue-200">{OPPORTUNITY_STAGES.map((stage) => <option key={stage.value} value={stage.value}>{stage.label}</option>)}</select><Link href={`/opportunities/${opportunity.id}/edit`} className="inline-flex h-8 items-center rounded-md border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-100"><Pencil className="mr-2 h-3.5 w-3.5" />Edit</Link><Button variant="ghost" size="icon" onClick={() => void removeOpportunity()} disabled={isDeleting} aria-label="Delete opportunity"><Trash2 className="h-4 w-4 text-red-500" /></Button></div>
      </div>
    </header>
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(19rem,0.72fr)]">
      <div className="space-y-6">
        <DetailSection title="Role and company" description="The context around this opportunity."><DetailField label="Job title" value={opportunity.jobTitle} /><DetailField label="Department" value={formatValue(opportunity.department)} /><DetailField label="Company" value={opportunity.companyName} /><DetailField label="Industry" value={formatValue(opportunity.companyIndustry)} /><DetailField label="Country" value={formatValue(opportunity.companyCountry)} /><DetailField label="Company size" value={formatValue(opportunity.companySize)} /><DetailField label="Employment" value={formatValue(opportunity.employmentType)} /><DetailField label="Work arrangement" value={formatValue(opportunity.workArrangement)} /><DetailField label="Location" value={formatValue(opportunity.location)} /><DetailField label="Source" value={formatValue(opportunity.source)} /><DetailField label="Referral" value={formatValue(opportunity.referral)} />{opportunity.jobUrl && <DetailField label="Job posting" value={<a href={opportunity.jobUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:underline">Open posting <ExternalLink className="h-3.5 w-3.5" /></a>} />}</DetailSection>
        <DetailSection title="Application progress"><DetailField label="Current stage" value={getStageLabel(opportunity.stage)} /><DetailField label="Priority" value={formatValue(opportunity.priority)} /><DetailField label="Date discovered" value={formatDate(opportunity.dateDiscovered)} /><DetailField label="Date applied" value={formatDate(opportunity.dateApplied)} /></DetailSection>
        <DetailSection title="Compensation" description="Keep the numbers and terms you want to remember together."><DetailField label="Salary range" value={opportunity.salaryRangeMin !== null || opportunity.salaryRangeMax !== null ? `${formatMoney(opportunity.salaryRangeMin, opportunity.currency)} - ${formatMoney(opportunity.salaryRangeMax, opportunity.currency)}` : 'Not added'} /><DetailField label="Pay frequency" value={formatValue(opportunity.payFrequency)} /><DetailField label="Minimum acceptable" value={formatMoney(opportunity.minimumAcceptableSalary, opportunity.currency)} /><DetailField label="Target salary" value={formatMoney(opportunity.targetSalary, opportunity.currency)} /><DetailField label="Maximum expected" value={formatMoney(opportunity.maximumExpectedSalary, opportunity.currency)} /><DetailField label="Contract rate" value={formatMoney(opportunity.contractRate, opportunity.currency)} /><DetailField label="Equity" value={formatValue(opportunity.equity)} /><DetailField label="Bonus" value={formatValue(opportunity.bonus)} /><DetailField label="Benefits" value={formatValue(opportunity.benefits)} wide /></DetailSection>
        <DetailSection title="Assessment"><DetailField label="Fit" value={opportunity.fitScore === null ? 'Not added' : `${opportunity.fitScore}%`} /><DetailField label="Interest" value={opportunity.interestScore === null ? 'Not added' : `${opportunity.interestScore}%`} /><DetailField label="Confidence" value={opportunity.confidenceScore === null ? 'Not added' : `${opportunity.confidenceScore}%`} /></DetailSection>
        <Card><CardHeader><CardTitle className="text-base">Job description</CardTitle></CardHeader><CardContent><p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">{opportunity.jobDescription || 'No job description added yet.'}</p></CardContent></Card>
      </div>
      <div className="lg:sticky lg:top-6 lg:self-start"><Card><OpportunityTimeline opportunityId={opportunity.id} /></Card></div>
    </div>
  </div>;
}

function DetailLoading() { return <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8"><div className="h-5 w-36 animate-pulse rounded bg-slate-200" /><div className="h-48 animate-pulse rounded-2xl bg-white shadow-sm" /><div className="grid gap-6 lg:grid-cols-2"><div className="h-96 animate-pulse rounded-xl bg-white" /><div className="h-96 animate-pulse rounded-xl bg-white" /></div></div>; }
function DetailError({ message, onRetry }: { message: string; onRetry: () => void }) { return <div className="mx-auto max-w-xl px-4 py-16 text-center"><AlertCircle className="mx-auto h-10 w-10 text-red-500" /><h1 className="mt-4 text-xl font-semibold text-slate-900">Unable to load opportunity</h1><p className="mt-2 text-sm text-slate-500">{message}</p><div className="mt-6 flex justify-center gap-3"><Button variant="outline" onClick={() => window.history.back()}>Go back</Button><Button onClick={onRetry}>Try again</Button></div></div>; }
function ErrorBanner({ message }: { message: string }) { return <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-700" role="alert"><AlertCircle className="h-4 w-4 shrink-0" />{message}</div>; }
