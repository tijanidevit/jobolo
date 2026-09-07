import { BarChart3, BriefcaseBusiness, Gift, MessageSquareText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { AnalyticsOverview } from '../../types';

export function AnalyticsMetrics({ metrics }: { metrics: AnalyticsOverview['metrics'] }) {
  const items = [
    { label: 'Opportunities', value: metrics.opportunities, icon: BriefcaseBusiness },
    { label: 'Applications', value: metrics.applications, icon: BarChart3 },
    { label: 'Interviews', value: metrics.interviews, icon: MessageSquareText },
    { label: 'Offers', value: metrics.offers, icon: Gift },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map(({ label, value, icon: Icon }) => (
        <Card key={label}>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
