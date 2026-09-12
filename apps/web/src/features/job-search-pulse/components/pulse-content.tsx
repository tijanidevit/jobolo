import type { JobSearchPulse } from '../types';
import { PulseHeader } from './pulse-header';
import { PulseMetricCard } from './pulse-metric-card';

export function PulseContent({ pulse }: { pulse: JobSearchPulse }) {
  const periodLabel = `${formatDate(pulse.period.current.start)} - ${formatDate(pulse.period.current.end)}`;

  return (
    <div className="space-y-8">
      <PulseHeader periodLabel={periodLabel} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <PulseMetricCard label="Applications" metric={pulse.metrics.applications} />
        <PulseMetricCard label="Recruiter responses" metric={pulse.metrics.responses} />
        <PulseMetricCard label="Interviews" metric={pulse.metrics.interviews} />
        <PulseMetricCard label="Offers" metric={pulse.metrics.offers} />
      </div>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(value));
}
