import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { TodayDashboardData } from '../../types';

export function ActiveOpportunities({
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
                    Due{' '}
                    {new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(
                      new Date(opportunity.nextActionDueDate),
                    )}
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
