import type { Insight } from '../types';
import { InsightCard } from './insight-card';

export function InsightsContent({ insights }: { insights: Insight[] }) {
  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2" aria-label="Personalized insights">
        {insights.map((insight) => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
      </section>
    </div>
  );
}
