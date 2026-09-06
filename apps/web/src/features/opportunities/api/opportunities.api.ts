import type { ApiResponse } from '@jobolo/shared';
import { api } from '@/lib/axios';
import type { Opportunity, OpportunityPayload } from '../types';
import type { OpportunityStatus } from '@jobolo/shared';

export const opportunitiesApi = {
  list: async () => {
    const response = await api.get<ApiResponse<Opportunity[]>>('/opportunities');
    return response.data;
  },

  get: async (id: string) => {
    const response = await api.get<ApiResponse<Opportunity>>(`/opportunities/${id}`);
    return response.data;
  },

  create: async (payload: OpportunityPayload) => {
    const response = await api.post<ApiResponse<Opportunity>>('/opportunities', payload);
    return response.data;
  },

  update: async (id: string, payload: Partial<OpportunityPayload>) => {
    const response = await api.patch<ApiResponse<unknown>>(`/opportunities/${id}`, payload);
    return response.data;
  },

  changeStage: async (id: string, stage: OpportunityStatus) => {
    const response = await api.patch<ApiResponse<unknown>>(`/opportunities/${id}/stage`, { stage });
    return response.data;
  },

  remove: async (id: string) => {
    const response = await api.delete<ApiResponse<null>>(`/opportunities/${id}`);
    return response.data;
  },
};
