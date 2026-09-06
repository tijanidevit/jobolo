import { z } from 'zod';
import { ACTIVITY_TYPES } from '../constants';
import type { OpportunityActivity } from '../types';

export const activityFormSchema = z.object({
  type: z.string().min(1, 'Choose an activity type'),
  title: z.string().trim().min(1, 'Title is required').max(255),
  description: z.string().max(10000),
  occurredAt: z.string().min(1, 'Date and time are required'),
});

export type ActivityFormValues = z.infer<typeof activityFormSchema>;

export function localDateTime() {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}

export function activityLabel(type: OpportunityActivity['type']) {
  return ACTIVITY_TYPES.find((item) => item.value === type)?.label ?? 'Activity';
}

export function activityFormValues(activity?: OpportunityActivity): ActivityFormValues {
  if (!activity) return { type: 'note', title: '', description: '', occurredAt: localDateTime() };
  const date = new Date(activity.occurredAt);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return {
    type: activity.type,
    title: activity.title,
    description: activity.description ?? '',
    occurredAt: date.toISOString().slice(0, 16),
  };
}

export function activityErrorMessage(error: unknown) {
  const message = (error as { response?: { data?: { message?: unknown } } }).response?.data
    ?.message;
  return typeof message === 'string' ? message : 'Something went wrong. Please try again.';
}

export function attachmentUrl(opportunityId: string, activityId: string, storedName: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  return `${apiUrl}/opportunities/${opportunityId}/activities/${activityId}/attachments/${storedName}`;
}
