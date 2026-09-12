import Link from 'next/link';
import { Activity, BarChart3, Lightbulb, WalletCards, ChartNoAxesCombined } from 'lucide-react';

const tabs = [
  { segment: '', label: 'Insights', icon: Lightbulb },
  { segment: 'analytics', label: 'Analytics', icon: BarChart3 },
  { segment: 'career-intelligence', label: 'Career intelligence', icon: ChartNoAxesCombined },
  { segment: 'pulse', label: 'Job search pulse', icon: Activity },
  { segment: 'salary-intelligence', label: 'Salary intelligence', icon: WalletCards },
] as const;

export function InsightsTabs({
  activeSegment,
}: {
  activeSegment: (typeof tabs)[number]['segment'];
}) {
  return (
    <nav
      aria-label="Insights sections"
      className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="flex min-w-max gap-1 p-2">
        {tabs.map(({ segment, label, icon: Icon }) => {
          const active = segment === activeSegment;
          return (
            <Link
              key={segment || 'insights'}
              href={segment ? `/insights/${segment}` : '/insights'}
              aria-current={active ? 'page' : undefined}
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
