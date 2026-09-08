import type { SalaryTrend } from '../types';

export function SalaryTrendCard({ trend }: { trend: SalaryTrend[] }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="font-semibold text-slate-900">Target salary over time</h2>
      <p className="mt-1 text-sm text-slate-500">
        Monthly averages from opportunities with a recorded application date.
      </p>
      <div className="mt-5 space-y-3">
        {trend.length === 0 ? (
          <p className="text-sm text-slate-500">No application salary history yet.</p>
        ) : (
          trend.map((item) => (
            <div
              key={`${item.period}-${item.currency}`}
              className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 text-sm last:border-0 last:pb-0"
            >
              <span className="text-slate-600">
                {formatPeriod(item.period)} · {item.currency}
              </span>
              <span className="font-medium text-slate-900">
                {formatSalary(item.averageTargetSalary, item.currency)}{' '}
                <span className="font-normal text-slate-400">({item.records})</span>
              </span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function formatPeriod(period: string) {
  const [year, month] = period.split('-').map(Number);
  return new Intl.DateTimeFormat(undefined, { month: 'short', year: 'numeric' }).format(
    new Date(year, month - 1, 1),
  );
}

function formatSalary(value: number | null, currency: string) {
  if (value === null) return 'Not recorded';
  return `${currency} ${new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(value)}`;
}
