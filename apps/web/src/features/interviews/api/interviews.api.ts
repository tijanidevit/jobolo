import type { ApiResponse } from '@jobolo/shared';
import { api } from '@/lib/axios';
import type { Interview, InterviewPayload } from '../types';

export const interviewsApi = {
  list: async (opportunityId: string) => {
    const response = await api.get<ApiResponse<Interview[]>>(
      `/opportunities/${opportunityId}/interviews`,
    );
    return response.data;
  },

  create: async (opportunityId: string, payload: InterviewPayload) => {
    const response = await api.post<ApiResponse<Interview>>(
      `/opportunities/${opportunityId}/interviews`,
      payload,
    );
    return response.data;
  },

  update: async (
    opportunityId: string,
    interviewId: string,
    payload: Partial<InterviewPayload>,
  ) => {
    const response = await api.patch<ApiResponse<Interview>>(
      `/opportunities/${opportunityId}/interviews/${interviewId}`,
      payload,
    );
    return response.data;
  },

  remove: async (opportunityId: string, interviewId: string) => {
    const response = await api.delete<ApiResponse<null>>(
      `/opportunities/${opportunityId}/interviews/${interviewId}`,
    );
    return response.data;
  },
};
