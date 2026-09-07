import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { CareerPerformanceMetric } from '../types';

export function CareerPerformanceCard({
  title,
  description,
  icon: Icon,
  rows,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  rows: CareerPerformanceMetric[];
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="text-sm text-slate-500">Apply to more opportunities to see a comparison.</p>
        ) : (
          <div className="space-y-4">
            {rows.slice(0, 10).map((row) => (
              <div key={row.label} className="rounded-lg border border-slate-100 p-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="truncate text-sm font-medium text-slate-800">{row.label}</span>
                  <span className="shrink-0 text-sm font-semibold text-blue-700">
                    {row.interviewRate}% interview rate
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span>{row.applications} applications</span>
                  <span>{row.responses} responses</span>
                  <span>{row.offers} offers</span>
                  {row.averageSalary !== null && (
                    <span>Avg. salary: {formatSalary(row.averageSalary, row.salaryCurrency)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function formatSalary(value: number, currency: string | null) {
  return `${currency && currency !== 'Mixed' ? `${currency} ` : ''}${value.toLocaleString()}${currency === 'Mixed' ? ' mixed' : ''}`;
}
