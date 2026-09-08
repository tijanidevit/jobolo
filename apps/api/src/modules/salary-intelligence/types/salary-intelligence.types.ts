export type SalaryBreakdown = {
  label: string;
  currency: string;
  records: number;
  averageTargetSalary: number | null;
  averageRangeMidpoint: number | null;
};

export type SalaryTrend = {
  period: string;
  currency: string;
  records: number;
  averageTargetSalary: number | null;
};

export type SalaryIntelligenceResponse = {
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
};
