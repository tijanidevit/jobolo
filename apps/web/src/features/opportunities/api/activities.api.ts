import type { ApiResponse } from '@jobolo/shared';
import { api } from '@/lib/axios';
import type { OpportunityActivity } from '../types';
import { OPPORTUNITY_PAGE_SIZE } from '../constants';
import type { PaginationMeta } from '@jobolo/shared';

type OpportunityActivityPage = ApiResponse<OpportunityActivity[]> & { meta: PaginationMeta };

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
  list: async (opportunityId: string, page = 1, limit = OPPORTUNITY_PAGE_SIZE) => {
    const response = await api.get<OpportunityActivityPage>(
      `/opportunities/${opportunityId}/activities`,
      { params: { page, limit } },
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

  update: async (
    opportunityId: string,
    activityId: string,
    payload: UpdateActivityPayload,
    files: File[] = [],
  ) => {
    const formData = new FormData();
    if (payload.type !== undefined) formData.append('type', payload.type);
    if (payload.title !== undefined) formData.append('title', payload.title);
    if (payload.description !== undefined) formData.append('description', payload.description);
    if (payload.occurredAt !== undefined) formData.append('occurredAt', payload.occurredAt);
    files.forEach((file) => formData.append('files', file));
    const response = await api.patch<ApiResponse<OpportunityActivity>>(
      `/opportunities/${opportunityId}/activities/${activityId}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return response.data;
  },

  downloadAttachment: async (opportunityId: string, activityId: string, storedName: string) => {
    const response = await api.get<Blob>(
      `/opportunities/${opportunityId}/activities/${activityId}/attachments/${storedName}`,
      { responseType: 'blob' },
    );
    return response.data;
  },
};
