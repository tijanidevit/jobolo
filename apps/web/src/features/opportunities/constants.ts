import type { ActivityType, OpportunityStatus } from '@jobolo/shared';

export const OPPORTUNITY_PAGE_SIZE = 35;

export const ACTIVITY_TYPES: Array<{ value: ActivityType; label: string }> = [
  { value: 'application', label: 'Application' },
  { value: 'email', label: 'Email' },
  { value: 'phone_call', label: 'Phone call' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'linkedin_message', label: 'LinkedIn message' },
  { value: 'recruiter_screening', label: 'Recruiter screening' },
  { value: 'technical_interview', label: 'Technical interview' },
  { value: 'hr_interview', label: 'HR interview' },
  { value: 'final_interview', label: 'Final interview' },
  { value: 'assessment', label: 'Assessment' },
  { value: 'offer', label: 'Offer' },
  { value: 'rejection', label: 'Rejection' },
  { value: 'follow_up', label: 'Follow-up' },
  { value: 'note', label: 'Note' },
];

export const OPPORTUNITY_STAGES: Array<{ value: OpportunityStatus; label: string }> = [
  { value: 'discovered', label: 'Discovered' },
  { value: 'interested', label: 'Interested' },
  { value: 'applied', label: 'Applied' },
  { value: 'recruiter_contact', label: 'Recruiter contact' },
  { value: 'screening', label: 'Screening' },
  { value: 'interview', label: 'Interview' },
  { value: 'final_round', label: 'Final round' },
  { value: 'offer', label: 'Offer' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'declined', label: 'Declined' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'withdrawn', label: 'Withdrawn' },
  { value: 'ghosted', label: 'Ghosted' },
  { value: 'expired', label: 'Expired' },
];

export const OPPORTUNITY_PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
] as const;

export const EMPLOYMENT_TYPES = [
  { value: 'full_time', label: 'Full time' },
  { value: 'part_time', label: 'Part time' },
  { value: 'contract', label: 'Contract' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'internship', label: 'Internship' },
] as const;

export const WORK_ARRANGEMENTS = [
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'onsite', label: 'On-site' },
] as const;

export function getStageLabel(stage: OpportunityStatus) {
  return OPPORTUNITY_STAGES.find((item) => item.value === stage)?.label ?? stage;
}
