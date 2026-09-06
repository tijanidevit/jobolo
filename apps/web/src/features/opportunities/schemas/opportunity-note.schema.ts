import { z } from 'zod';

export const opportunityNoteSchema = z.object({
  content: z.string().trim().min(1, 'Write something before saving.').max(10000),
});

export type OpportunityNoteFormValues = z.infer<typeof opportunityNoteSchema>;
