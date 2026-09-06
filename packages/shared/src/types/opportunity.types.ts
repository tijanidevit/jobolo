/**
 * Opportunity domain types shared between frontend and backend.
 * These are TypeScript interfaces — no runtime code.
 */

export type OpportunityStatus =
  | 'discovered'
  | 'interested'
  | 'applied'
  | 'recruiter_contact'
  | 'screening'
  | 'interview'
  | 'final_round'
  | 'offer'
  | 'accepted'
  | 'declined'
  | 'rejected'
  | 'withdrawn'
  | 'ghosted'
  | 'expired';

export const OPPORTUNITY_STATUSES: OpportunityStatus[] = [
  'discovered',
  'interested',
  'applied',
  'recruiter_contact',
  'screening',
  'interview',
  'final_round',
  'offer',
  'accepted',
  'declined',
  'rejected',
  'withdrawn',
  'ghosted',
  'expired',
];

export type OpportunityPriority = 'low' | 'medium' | 'high';

export type WorkArrangement = 'remote' | 'hybrid' | 'onsite';

export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'freelance' | 'internship';

export type PayFrequency = 'annual' | 'monthly' | 'weekly' | 'daily' | 'hourly';

export type ActivityType =
  | 'application'
  | 'email'
  | 'phone_call'
  | 'whatsapp'
  | 'linkedin_message'
  | 'recruiter_screening'
  | 'technical_interview'
  | 'hr_interview'
  | 'final_interview'
  | 'assessment'
  | 'offer'
  | 'rejection'
  | 'follow_up'
  | 'note'
  | 'status_change';

export const ACTIVITY_TYPES: ActivityType[] = [
  'application',
  'email',
  'phone_call',
  'whatsapp',
  'linkedin_message',
  'recruiter_screening',
  'technical_interview',
  'hr_interview',
  'final_interview',
  'assessment',
  'offer',
  'rejection',
  'follow_up',
  'note',
  'status_change',
];
