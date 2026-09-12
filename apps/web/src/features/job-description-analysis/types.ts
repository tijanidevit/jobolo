export type AnalysisProvider = 'ai' | 'local';

export interface JobDescriptionAnalysis {
  provider: AnalysisProvider;
  sourceUrl: string | null;
  sourceDescription: string;
  companyName: string | null;
  jobTitle: string | null;
  summary: string;
  skills: string[];
  experienceRequirements: string[];
  salary: string | null;
  location: string | null;
  seniority: string | null;
  employmentType: string | null;
  interviewRequirements: string[];
}
