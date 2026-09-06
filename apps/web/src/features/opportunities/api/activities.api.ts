import type { ApiResponse } from '@jobolo/shared';
import { api } from '@/lib/axios';
import type { OpportunityActivity } from '../types';

export interface CreateActivityPayload {
  type: OpportunityActivity['type'];
  title: string;
  description?: string;
  occurredAt: string;
}

export interface UpdateActivityPayload {
  type?: OpportunityActivity['type'];
  title?: string;
  description?: string;
  occurredAt?: string;
}

export const activitiesApi = {
  list: async (opportunityId: string) => {
    const response = await api.get<ApiResponse<OpportunityActivity[]>>(
      `/opportunities/${opportunityId}/activities`,
    );
    return response.data;
  },

  create: async (opportunityId: string, payload: CreateActivityPayload, files: File[] = []) => {
    const formData = new FormData();
    formData.append('type', payload.type);
    formData.append('title', payload.title);
    formData.append('description', payload.description ?? '');
    formData.append('occurredAt', payload.occurredAt);
    files.forEach((file) => formData.append('files', file));
    const response = await api.post<ApiResponse<OpportunityActivity>>(
      `/opportunities/${opportunityId}/activities`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
    return response.data;
  },

  update: async (opportunityId: string, activityId: string, payload: UpdateActivityPayload) => {
    const response = await api.patch<ApiResponse<OpportunityActivity>>(
      `/opportunities/${opportunityId}/activities/${activityId}`,
      payload,
    );
    return response.data;
  },
};
