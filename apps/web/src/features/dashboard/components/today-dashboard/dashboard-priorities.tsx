import Link from 'next/link';
import { AlertTriangle, CalendarClock, Clock3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { TodayDashboardData } from '../../types';

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(
    new Date(value),
  );
}

export function DashboardPriorities({
  priorities,
}: {
  priorities: TodayDashboardData['priorities'];
}) {
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
