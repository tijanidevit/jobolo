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
  advanced: AnalyticsAdvanced;
}

export interface AnalyticsGroupedMetric {
  label: string;
  count: number;
  average: number;
  currency: string | null;
}

export interface AnalyticsSuccessMetric {
  label: string;
  applications: number;
  responses: number;
  interviews: number;
  offers: number;
  responseRate: number;
  interviewRate: number;
  offerRate: number;
}

export interface AnalyticsAdvanced {
  responseRate: number | null;
  interviewConversionRate: number | null;
  offerConversionRate: number | null;
  averageTimeToResponseDays: number | null;
  averageTimeBetweenStagesDays: number | null;
  averageSalary: number | null;
  salaryCurrency: string | null;
  salaryByCountry: AnalyticsGroupedMetric[];
  salaryByRole: AnalyticsGroupedMetric[];
  successBySource: AnalyticsSuccessMetric[];
  successByRole: AnalyticsSuccessMetric[];
  successByCompanySize: AnalyticsSuccessMetric[];
}
