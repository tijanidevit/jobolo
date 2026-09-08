import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PulseMetric } from '../types';

export function PulseMetricCard({ label, metric }: { label: string; metric: PulseMetric }) {
  const direction =
    metric.change === null
      ? 'neutral'
      : metric.change > 0
        ? 'up'
        : metric.change < 0
          ? 'down'
          : 'neutral';
  const Icon = direction === 'up' ? ArrowUpRight : direction === 'down' ? ArrowDownRight : Minus;
  const color =
    direction === 'up'
      ? 'text-emerald-600'
      : direction === 'down'
        ? 'text-red-600'
        : 'text-slate-400';

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-slate-500">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-slate-900">{metric.current}</p>
        <div className={`mt-2 flex items-center gap-1 text-xs font-medium ${color}`}>
          <Icon className="h-3.5 w-3.5" />
          {metric.change === null
            ? 'No previous activity'
            : `${Math.abs(metric.change)}% vs previous period`}
        </div>
        <p className="mt-1 text-xs text-slate-400">Previous period: {metric.previous}</p>
      </CardContent>
    </Card>
  );
}
