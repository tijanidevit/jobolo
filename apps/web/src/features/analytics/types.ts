export interface AnalyticsBreakdownItem {
  label: string;
  count: number;
}

export interface AnalyticsOverview {
  metrics: {
    opportunities: number;
    applications: number;
    interviews: number;
    offers: number;
  };
  statusDistribution: AnalyticsBreakdownItem[];
  countryDistribution: AnalyticsBreakdownItem[];
}
