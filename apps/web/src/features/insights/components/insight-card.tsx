import { Activity, BarChart3, Globe2, Lightbulb, type LucideIcon } from 'lucide-react';
import type { Insight } from '../types';

const icons: Record<Insight['type'], LucideIcon> = {
  application_volume: Activity,
  role_conversion: BarChart3,
  country_response: Globe2,
  interview_skills: Lightbulb,
};

export function InsightCard({ insight }: { insight: Insight }) {
  const Icon = icons[insight.type];
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2 className="font-semibold text-slate-900">{insight.title}</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">{insight.message}</p>
        </div>
      </div>
      <ul className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-sm text-slate-500">
        {insight.details.map((detail) => (
          <li key={detail}>{detail}</li>
        ))}
      </ul>
    </article>
  );
}
