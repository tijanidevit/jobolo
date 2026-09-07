'use client';

import Link from 'next/link';
import { AlertTriangle, ArrowRight, CalendarClock, CheckCircle2, Clock3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useTodayDashboard } from '../hooks/use-today-dashboard';
import type { TodayDashboardData } from '../types';

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(
    new Date(value),
  );
}

export function TodayDashboard() {
  const { user } = useAuth();
  const { dashboard, isLoading, error, refetch } = useTodayDashboard();

  if (isLoading) return <LoadingState variant="page" message="Loading today..." />;
  if (error || !dashboard)
    return (
      <ErrorState
        variant="page"
        title="Unable to load today"
        message="Your priorities could not be loaded."
        onRetry={() => void refetch()}
      />
    );

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between sm:p-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">Today</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Good morning, {user?.firstName}
          </h1>
          <p className="mt-2 text-slate-500">
            Here is what needs your attention in the job search.
          </p>
        </div>
        <Link
          href="/opportunities/create"
          className="inline-flex h-9 items-center justify-center rounded-md bg-blue-600 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
        >
          Add opportunity
        </Link>
      </header>
      <MetricGrid metrics={dashboard.metrics} />
      <PriorityGrid priorities={dashboard.priorities} />
      <ActiveOpportunities opportunities={dashboard.activeOpportunities} />
    </div>
  );
}

function MetricGrid({ metrics }: { metrics: TodayDashboardData['metrics'] }) {
  const items = [
    ['Applications', metrics.applications, 'All applications'],
    ['Interviews', metrics.interviews, 'Recorded interviews'],
    ['Final rounds', metrics.finalRounds, 'Opportunities at final round'],
    ['Offers', metrics.offers, 'Offers and accepted roles'],
  ];
  items.push(['This week', metrics.applicationsThisWeek, 'Applications added in the last 7 days']);
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {items.map(([label, value, detail]) => (
        <Card key={label as string}>
          <CardHeader className="pb-2">
            <CardDescription>{label as string}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900">{value as number}</p>
            <p className="mt-1 text-xs text-slate-500">{detail as string}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function PriorityGrid({ priorities }: { priorities: TodayDashboardData['priorities'] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <PriorityCard
        title="Overdue tasks"
        icon={<AlertTriangle className="h-4 w-4 text-red-600" />}
        empty="No overdue tasks"
        tasks={priorities.overdueTasks}
        tone="red"
      />
      <PriorityCard
        title="Due today"
        icon={<Clock3 className="h-4 w-4 text-amber-600" />}
        empty="Nothing due today"
        tasks={priorities.dueTodayTasks}
        tone="amber"
      />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upcoming interviews</CardTitle>
          <CardDescription>Prepare for what is next.</CardDescription>
        </CardHeader>
        <CardContent>
          {priorities.upcomingInterviews.length === 0 ? (
            <p className="text-sm text-slate-500">No upcoming interviews.</p>
          ) : (
            <div className="space-y-3">
              {priorities.upcomingInterviews.slice(0, 4).map((interview) => (
                <Link
                  key={interview.id}
                  href={`/opportunities/${interview.opportunityId}`}
                  className="block rounded-lg border border-slate-200 p-3 hover:border-blue-300 hover:bg-blue-50/40"
                >
                  <p className="text-sm font-semibold text-slate-800">{interview.type} interview</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                    <CalendarClock className="h-3.5 w-3.5" />
                    {formatDate(interview.scheduledAt)}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function PriorityCard({
  title,
  icon,
  empty,
  tasks,
  tone,
}: {
  title: string;
  icon: React.ReactNode;
  empty: string;
  tasks: TodayDashboardData['priorities']['overdueTasks'];
  tone: 'red' | 'amber';
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          {icon}
          {title}
        </CardTitle>
        <CardDescription>Tasks requiring action.</CardDescription>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <p className="text-sm text-slate-500">{empty}</p>
        ) : (
          <div className="space-y-3">
            {tasks.slice(0, 4).map((task) => (
              <Link
                key={task.id}
                href={`/opportunities/${task.opportunityId}`}
                className={`block rounded-lg border p-3 hover:bg-slate-50 ${tone === 'red' ? 'border-red-100' : 'border-amber-100'}`}
              >
                <p className="text-sm font-semibold text-slate-800">{task.title}</p>
                {task.dueDate && (
                  <p className="mt-1 text-xs text-slate-500">{formatDate(task.dueDate)}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ActiveOpportunities({
  opportunities,
}: {
  opportunities: TodayDashboardData['activeOpportunities'];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Active opportunities</CardTitle>
        <CardDescription>Opportunities with a next action to keep moving.</CardDescription>
      </CardHeader>
      <CardContent>
        {opportunities.length === 0 ? (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            No active opportunities need a next action.
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {opportunities.map((opportunity) => (
              <Link
                key={opportunity.id}
                href={`/opportunities/${opportunity.id}`}
                className="group rounded-lg border border-slate-200 p-4 hover:border-blue-300 hover:bg-blue-50/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{opportunity.jobTitle}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {opportunity.companyName} · {opportunity.stage.replaceAll('_', ' ')}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-blue-600" />
                </div>
                <p className="mt-3 text-sm text-blue-700">{opportunity.nextAction}</p>
                {opportunity.nextActionDueDate && (
                  <p className="mt-1 text-xs text-slate-500">
                    Due {formatDate(opportunity.nextActionDueDate)}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
