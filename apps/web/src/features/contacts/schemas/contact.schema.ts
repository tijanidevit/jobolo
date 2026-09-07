import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(255),
  jobTitle: z.string().trim().max(255),
  email: z.union([z.string().trim().email('Enter a valid email'), z.literal('')]),
  phone: z.string().trim().max(50),
  linkedin: z.union([z.string().trim().url('Enter a valid URL'), z.literal('')]),
  relationship: z.string().trim().max(100),
  notes: z.string().trim().max(10000),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
