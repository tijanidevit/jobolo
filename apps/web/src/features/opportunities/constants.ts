import type { OpportunityStatus } from '@jobolo/shared';

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
