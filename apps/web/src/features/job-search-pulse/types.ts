export interface PulseMetric {
  current: number;
  previous: number;
  change: number | null;
}

export interface JobSearchPulse {
  period: {
    current: { start: string; end: string };
    previous: { start: string; end: string };
  };
  metrics: {
    applications: PulseMetric;
    responses: PulseMetric;
    interviews: PulseMetric;
    offers: PulseMetric;
  };
}
