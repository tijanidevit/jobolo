import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().trim().min(1, 'Enter a task title.'),
  description: z.string(),
  dueDate: z.string(),
  priority: z.enum(['low', 'medium', 'high']),
  reminderAt: z.string(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;
