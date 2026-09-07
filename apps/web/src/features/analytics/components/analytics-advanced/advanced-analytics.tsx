import { Clock3, DollarSign, Gauge, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { AnalyticsAdvanced, AnalyticsGroupedMetric, AnalyticsSuccessMetric } from '../../types';

export function AdvancedAnalytics({ analytics }: { analytics: AnalyticsAdvanced }) {
  return (
    <section className="space-y-6" aria-labelledby="advanced-analytics-title">
      <div>
        <h2 id="advanced-analytics-title" className="text-xl font-semibold text-slate-900">
          Advanced analytics
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          See where your search is converting and how quickly opportunities move.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <InsightCard label="Response rate" value={formatRate(analytics.responseRate)} icon={TrendingUp} />
        <InsightCard
          label="Interview conversion"
          value={formatRate(analytics.interviewConversionRate)}
          icon={Gauge}
        />
        <InsightCard label="Offer conversion" value={formatRate(analytics.offerConversionRate)} icon={TrendingUp} />
        <InsightCard
          label="Avg. time to response"
          value={formatDays(analytics.averageTimeToResponseDays)}
          icon={Clock3}
        />
        <InsightCard
          label="Avg. time between stages"
          value={formatDays(analytics.averageTimeBetweenStagesDays)}
          icon={Clock3}
        />
        <InsightCard
          label="Avg. salary"
          value={formatSalary(analytics.averageSalary, analytics.salaryCurrency)}
          icon={DollarSign}
        />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <MetricTable
          title="Salary by country"
          description="Average midpoint of recorded salary ranges."
          rows={analytics.salaryByCountry}
          valueLabel="Average"
          formatValue={(row) => formatSalary(row.average, row.currency)}
        />
        <MetricTable
          title="Salary by role"
          description="Compare compensation across the roles you track."
          rows={analytics.salaryByRole}
          valueLabel="Average"
          formatValue={(row) => formatSalary(row.average, row.currency)}
        />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <SuccessTable title="By source" rows={analytics.successBySource} />
        <SuccessTable title="By role" rows={analytics.successByRole} />
        <SuccessTable title="By company size" rows={analytics.successByCompanySize} />
      </div>
      <p className="text-xs text-slate-400">
        Stage timing is based on recorded timeline stage changes. Salary averages are not combined
        across currencies when currencies differ.
      </p>
    </section>
  );
}

function InsightCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof TrendingUp;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs text-slate-500">{label}</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function MetricTable({
  title,
  description,
  rows,
  valueLabel,
  formatValue,
}: {
  title: string;
  description: string;
  rows: AnalyticsGroupedMetric[];
  valueLabel: string;
  formatValue: (row: AnalyticsGroupedMetric) => string;
}) {
  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
        {rows.length === 0 ? (
          <p className="text-sm text-slate-500">No salary data yet.</p>
        ) : (
          <div className="space-y-3">
            {rows.slice(0, 5).map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-4 text-sm">
                <span className="truncate text-slate-700">{row.label}</span>
                <span className="shrink-0 font-semibold text-slate-900">
                  {formatValue(row)} <span className="font-normal text-slate-400">({row.count})</span>
                </span>
              </div>
            ))}
          </div>
        )}
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{valueLabel}</p>
      </CardContent>
    </Card>
  );
}

function SuccessTable({ title, rows }: { title: string; rows: AnalyticsSuccessMetric[] }) {
  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Success {title.toLowerCase()}</h3>
          <p className="mt-1 text-sm text-slate-500">Conversion rates from recorded applications.</p>
        </div>
        {rows.length === 0 ? (
          <p className="text-sm text-slate-500">No application data yet.</p>
        ) : (
          <div className="space-y-3">
            {rows.slice(0, 5).map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-3 text-sm">
                <span className="truncate text-slate-700">{row.label}</span>
                <span className="shrink-0 text-right text-xs">
                  <strong className="font-semibold text-slate-900">{row.responseRate}%</strong>
                  <span className="ml-1 text-slate-400">response</span>
                  <br />
                  <strong className="font-semibold text-slate-900">{row.interviewRate}%</strong>
                  <span className="ml-1 text-slate-400">interview</span>
                  <br />
                  <strong className="font-semibold text-slate-900">{row.offerRate}%</strong>
                  <span className="ml-1 text-slate-400">offer</span>
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function formatRate(value: number | null) {
  return value === null ? 'No data' : `${value}%`;
}

function formatDays(value: number | null) {
  return value === null ? 'No data' : `${value} days`;
}

function formatSalary(value: number | null, currency: string | null) {
  return value === null
    ? 'No data'
    : `${currency && currency !== 'Mixed' ? `${currency} ` : ''}${value.toLocaleString()}${currency === 'Mixed' ? ' mixed' : ''}`;
}
