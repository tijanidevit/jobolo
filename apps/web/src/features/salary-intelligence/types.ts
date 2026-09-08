export interface SalaryBreakdown {
  label: string;
  currency: string;
  records: number;
  averageTargetSalary: number | null;
  averageRangeMidpoint: number | null;
}

export interface SalaryTrend {
  period: string;
  currency: string;
  records: number;
  averageTargetSalary: number | null;
}

export interface SalaryIntelligence {
  summary: {
    recordedOpportunities: number;
    currencies: string[];
    averageTargetSalary: number | null;
    averageRangeMidpoint: number | null;
  };
  currencySummaries: Array<{
    currency: string;
    records: number;
    averageTargetSalary: number | null;
    averageRangeMidpoint: number | null;
    lowestTargetSalary: number | null;
    highestTargetSalary: number | null;
  }>;
  trend: SalaryTrend[];
  byRole: SalaryBreakdown[];
  byCountry: SalaryBreakdown[];
}
