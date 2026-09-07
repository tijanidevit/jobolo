export interface CareerPerformanceMetric {
  label: string;
  applications: number;
  responses: number;
  interviews: number;
  offers: number;
  responseRate: number;
  interviewRate: number;
  offerRate: number;
  averageSalary: number | null;
  salaryCurrency: string | null;
}

export interface CareerIntelligence {
  rolePerformance: CareerPerformanceMetric[];
  countryPerformance: CareerPerformanceMetric[];
}
