import { z } from 'zod';

const optionalNumber = (label: string, min: number, max?: number) =>
  z.string().refine(
    (value) => {
      if (!value.trim()) return true;
      const number = Number(value);
      return Number.isFinite(number) && number >= min && (max === undefined || number <= max);
    },
    `${label} must be a valid number${max === undefined ? '' : ` between ${min} and ${max}`}`,
  );

export const opportunityFormSchema = z.object({
  companyName: z.string().trim().min(1, 'Company name is required').max(255),
  jobTitle: z.string().trim().min(1, 'Job title is required').max(255),
  companyCountry: z.string().max(100),
  location: z.string().max(255),
  jobUrl: z
    .string()
    .refine(
      (value) => !value || /^https?:\/\//.test(value),
      'Enter a valid URL starting with http:// or https://',
    ),
  employmentType: z.enum(['', 'full_time', 'part_time', 'contract', 'freelance', 'internship']),
  workArrangement: z.enum(['', 'remote', 'hybrid', 'onsite']),
  stage: z.enum([
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
  ]),
  source: z.string().max(255),
  dateDiscovered: z.string(),
  dateApplied: z.string(),
  currency: z.string().max(10),
  salaryRangeMin: optionalNumber('Minimum salary', 0),
  salaryRangeMax: optionalNumber('Maximum salary', 0),
  targetSalary: optionalNumber('Target salary', 0),
  fitScore: optionalNumber('Fit score', 0, 100),
  interestScore: optionalNumber('Interest score', 0, 100),
  confidenceScore: optionalNumber('Confidence score', 0, 100),
  priority: z.enum(['', 'low', 'medium', 'high']),
  jobDescription: z.string().max(10000),
});

export type OpportunityFormValues = z.infer<typeof opportunityFormSchema>;
