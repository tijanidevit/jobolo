import type { Insight } from '../types';
import { InsightCard } from './insight-card';
import { InsightsHeader } from './insights-header';

export function InsightsContent({ insights }: { insights: Insight[] }) {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <InsightsHeader />
      <section className="grid gap-4 md:grid-cols-2" aria-label="Personalized insights">
        {insights.map((insight) => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
      </section>
    </div>
  );
}
