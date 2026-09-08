import type { SalaryBreakdown } from '../types';

export function SalaryBreakdownCard({
  title,
  description,
  rows,
}: {
  title: string;
  description: string;
  rows: SalaryBreakdown[];
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="font-semibold text-slate-900">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
      <div className="mt-5 overflow-x-auto">
        {rows.length === 0 ? (
          <p className="text-sm text-slate-500">No breakdown data yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="pb-3 font-medium">Group</th>
                <th className="pb-3 font-medium">Currency</th>
                <th className="pb-3 text-right font-medium">Records</th>
                <th className="pb-3 text-right font-medium">Avg. target</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={`${row.label}-${row.currency}`}>
                  <td className="py-3 font-medium text-slate-700">{row.label}</td>
                  <td className="py-3 text-slate-500">{row.currency}</td>
                  <td className="py-3 text-right text-slate-500">{row.records}</td>
                  <td className="py-3 text-right text-slate-700">
                    {formatSalary(row.averageTargetSalary, row.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

function formatSalary(value: number | null, currency: string) {
  if (value === null) return 'Not recorded';
  return `${currency} ${new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(value)}`;
}
