export const INTERVIEW_TYPES = [
  'Recruiter',
  'HR',
  'Technical',
  'System design',
  'Behavioral',
  'Pair programming',
  'Managerial',
] as const;

export type InterviewType = (typeof INTERVIEW_TYPES)[number];

export interface Interview {
  id: string;
  userId: string;
  opportunityId: string;
  type: string;
  scheduledAt: string;
  durationMinutes: number | null;
  interviewers: string | null;
  meetingLocation: string | null;
  stage: string | null;
  notes: string | null;
  performanceRating: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface InterviewPayload {
  type: string;
  scheduledAt: string;
  durationMinutes?: number;
  interviewers?: string;
  meetingLocation?: string;
  stage?: string;
  notes?: string;
  performanceRating?: number;
}
