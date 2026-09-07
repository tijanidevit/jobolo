import { z } from 'zod';

export const interviewSchema = z.object({
  type: z.string().min(1, 'Choose an interview type.'),
  scheduledAt: z.string().min(1, 'Choose a date and time.'),
  durationMinutes: z.string(),
  interviewers: z.string(),
  meetingLocation: z.string(),
  stage: z.string(),
  notes: z.string(),
  performanceRating: z.string(),
});

export type InterviewFormValues = z.infer<typeof interviewSchema>;
