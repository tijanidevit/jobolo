export type InsightType =
  'application_volume' | 'role_conversion' | 'country_response' | 'interview_skills';

export interface Insight {
  id: string;
  type: InsightType;
  title: string;
  message: string;
  details: string[];
}

export interface InsightsResponse {
  insights: Insight[];
}
