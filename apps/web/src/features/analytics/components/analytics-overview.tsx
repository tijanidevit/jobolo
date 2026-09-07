'use client';

import { BarChart3, BriefcaseBusiness, Gift, MessageSquareText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { useAnalyticsOverview } from '../hooks/use-analytics-overview';
import type { AnalyticsBreakdownItem, AnalyticsOverview as AnalyticsOverviewData } from '../types';

export function AnalyticsOverview() {
  const { analytics, isLoading, error, refetch } = useAnalyticsOverview();

  if (isLoading) return <LoadingState variant="page" message="Loading analytics..." />;
  if (error || !analytics) return <ErrorState variant="page" title="Unable to load analytics" message="Your job-search analytics could not be loaded." onRetry={() => void refetch()} />;

  return <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8"><header><p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">Analytics</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Job search overview</h1><p className="mt-2 text-slate-500">Understand your application pipeline at a glance.</p></header><MetricGrid metrics={analytics.metrics} /><div className="grid gap-6 lg:grid-cols-2"><BreakdownCard title="Status distribution" description="Where your opportunities are in the pipeline." items={analytics.statusDistribution} /><BreakdownCard title="Country distribution" description="Where the opportunities in your pipeline are located." items={analytics.countryDistribution} /></div></div>;
}

function MetricGrid({ metrics }: { metrics: AnalyticsOverviewData['metrics'] }) {
  const items = [
    { label: 'Opportunities', value: metrics.opportunities, icon: BriefcaseBusiness },
    { label: 'Applications', value: metrics.applications, icon: BarChart3 },
    { label: 'Interviews', value: metrics.interviews, icon: MessageSquareText },
    { label: 'Offers', value: metrics.offers, icon: Gift },
  ];
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{items.map(({ label, value, icon: Icon }) => <Card key={label}><CardContent className="flex items-center gap-4 p-5"><div className="rounded-xl bg-blue-50 p-3 text-blue-600"><Icon className="h-5 w-5" /></div><div><p className="text-sm text-slate-500">{label}</p><p className="mt-1 text-3xl font-bold text-slate-900">{value}</p></div></CardContent></Card>)}</div>;
}

function BreakdownCard({ title, description, items }: { title: string; description: string; items: AnalyticsBreakdownItem[] }) {
  const maximum = Math.max(...items.map((item) => item.count), 1);
  return <Card><CardHeader><CardTitle className="text-base">{title}</CardTitle><CardDescription>{description}</CardDescription></CardHeader><CardContent>{items.length === 0 ? <p className="text-sm text-slate-500">No data yet.</p> : <div className="space-y-4">{items.map((item) => <div key={item.label}><div className="mb-1.5 flex items-center justify-between gap-3 text-sm"><span className="capitalize text-slate-700">{item.label.replaceAll('_', ' ')}</span><span className="font-semibold text-slate-900">{item.count}</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-600" style={{ width: `${(item.count / maximum) * 100}%` }} /></div></div>)}</div>}</CardContent></Card>;
}
