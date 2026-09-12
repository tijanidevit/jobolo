'use client';

import { usePathname } from 'next/navigation';
import { InsightsTabs } from '@/features/insights/components/insights-tabs';

export default function InsightsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const activeSegment = getActiveSegment(pathname);

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">
          Insights workspace
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
          Understand your job search
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          Explore evidence from your applications, opportunities, skills, and career history.
        </p>
      </header>
      <InsightsTabs activeSegment={activeSegment} />
      <main>{children}</main>
    </div>
  );
}

function getActiveSegment(
  pathname: string,
): '' | 'analytics' | 'career-intelligence' | 'pulse' | 'salary-intelligence' {
  const segment = pathname.split('/').filter(Boolean).at(-1);
  return segment === 'analytics' ||
    segment === 'career-intelligence' ||
    segment === 'pulse' ||
    segment === 'salary-intelligence'
    ? segment
    : '';
}
