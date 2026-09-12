import type { SalaryIntelligence } from '../types';
import { SalaryBreakdownCard } from './salary-breakdown-card';
import { SalaryIntelligenceHeader } from './salary-intelligence-header';
import { SalarySummaryCard, salarySummaryIcons } from './salary-summary-card';
import { SalaryTrendCard } from './salary-trend-card';

export function SalaryIntelligenceContent({ intelligence }: { intelligence: SalaryIntelligence }) {
  const currency =
    intelligence.summary.currencies.length === 1 ? intelligence.summary.currencies[0] : null;
  return (
    <div className="space-y-8">
      <SalaryIntelligenceHeader />
      <div className="grid gap-4 md:grid-cols-3">
        <SalarySummaryCard
          label="Average target"
          value={formatSalary(intelligence.summary.averageTargetSalary, currency)}
          description="Across recorded targets in one currency."
          icon={salarySummaryIcons.target}
        />
        <SalarySummaryCard
          label="Average range midpoint"
          value={formatSalary(intelligence.summary.averageRangeMidpoint, currency)}
          description="Based on recorded minimum and maximum ranges."
          icon={salarySummaryIcons.average}
        />
        <SalarySummaryCard
          label="Salary records"
          value={String(intelligence.summary.recordedOpportunities)}
          description={`${intelligence.summary.currencies.join(', ') || 'No currency'} represented.`}
          icon={salarySummaryIcons.records}
        />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <SalaryTrendCard trend={intelligence.trend} />
        <SalaryCurrencySummary summaries={intelligence.currencySummaries} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <SalaryBreakdownCard
          title="By role"
          description="Recorded compensation grouped by target role."
          rows={intelligence.byRole}
        />
        <SalaryBreakdownCard
          title="By country"
          description="Recorded compensation grouped by company country."
          rows={intelligence.byCountry}
        />
      </div>
    </div>
  );
}

function SalaryCurrencySummary({
  summaries,
}: {
  summaries: SalaryIntelligence['currencySummaries'];
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="font-semibold text-slate-900">By currency</h2>
      <p className="mt-1 text-sm text-slate-500">
        Currency-specific ranges prevent misleading comparisons.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {summaries.map((summary) => (
          <div key={summary.currency} className="rounded-lg bg-slate-50 p-4">
            <p className="font-semibold text-slate-900">{summary.currency}</p>
            <p className="mt-2 text-sm text-slate-600">
              {summary.records} record{summary.records === 1 ? '' : 's'}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Target: {formatSalary(summary.averageTargetSalary, summary.currency)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Range midpoint: {formatSalary(summary.averageRangeMidpoint, summary.currency)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function formatSalary(value: number | null, currency: string | null) {
  if (value === null || currency === null) return 'Mixed currencies';
  return `${currency} ${new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(value)}`;
}
