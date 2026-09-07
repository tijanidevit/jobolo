import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import type { TodayDashboardData } from '../../types';

export function DashboardMetrics({ metrics }: { metrics: TodayDashboardData['metrics'] }) {
  const items = [
    ['Applications', metrics.applications, 'All applications'],
    ['Interviews', metrics.interviews, 'Recorded interviews'],
    ['Final rounds', metrics.finalRounds, 'Opportunities at final round'],
    ['Offers', metrics.offers, 'Offers and accepted roles'],
    ['This week', metrics.applicationsThisWeek, 'Applications added in the last 7 days'],
  ] as const;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {items.map(([label, value, detail]) => (
        <Card key={label}>
          <CardHeader className="pb-2">
            <CardDescription>{label}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900">{value}</p>
            <p className="mt-1 text-xs text-slate-500">{detail}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
