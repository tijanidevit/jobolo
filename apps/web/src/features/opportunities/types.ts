import type {
  ActivityType,
  EmploymentType,
  OpportunityPriority,
  OpportunityStatus,
  PayFrequency,
  WorkArrangement,
} from '@jobolo/shared';

export interface OpportunityActivity {
  id: string;
  userId: string;
  opportunityId: string;
  type: ActivityType;
  title: string;
  description: string | null;
  occurredAt: string;
  createdAt: string;
  attachments: OpportunityActivityAttachment[];
}

export interface OpportunityActivityAttachment {
  id: string;
  originalName: string;
  storedName: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

export interface OpportunityNote {
  id: string;
  userId: string;
  opportunityId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  attachments: OpportunityNoteAttachment[];
}

export interface OpportunityNoteAttachment {
  id: string;
  originalName: string;
  storedName: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

export interface Opportunity {
  id: string;
  userId: string;
  companyName: string;
  companyWebsite: string | null;
  companyCountry: string | null;
  companyIndustry: string | null;
  companySize: string | null;
  jobTitle: string;
  department: string | null;
  jobDescription: string | null;
  jobUrl: string | null;
  employmentType: EmploymentType | null;
  workArrangement: WorkArrangement | null;
  location: string | null;
  stage: OpportunityStatus;
  dateDiscovered: string | null;
  dateApplied: string | null;
  source: string | null;
  referral: string | null;
  currency: string | null;
  salaryRangeMin: number | null;
  salaryRangeMax: number | null;
  payFrequency: PayFrequency | null;
  minimumAcceptableSalary: number | null;
  targetSalary: number | null;
  maximumExpectedSalary: number | null;
  equity: string | null;
  bonus: string | null;
  benefits: string | null;
  contractRate: number | null;
  fitScore: number | null;
  interestScore: number | null;
  confidenceScore: number | null;
  priority: OpportunityPriority | null;
  nextAction: string | null;
  nextActionDueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export type OpportunityPayload = Partial<
  Omit<Opportunity, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
> & {
  companyName: string;
  jobTitle: string;
};

export interface OpportunityFilters {
  q?: string;
  companyName?: string;
  jobTitle?: string;
  companyCountry?: string;
  source?: string;
  stage?: OpportunityStatus;
  priority?: OpportunityPriority;
  workArrangement?: WorkArrangement;
  employmentType?: EmploymentType;
  salaryMin?: number;
  salaryMax?: number;
}
