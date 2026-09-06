import type { ApiResponse } from '@jobolo/shared';
import { api } from '@/lib/axios';
import type { OpportunityNote } from '../types';

export interface CreateOpportunityNotePayload {
  content: string;
}

export type UpdateOpportunityNotePayload = Partial<CreateOpportunityNotePayload>;

export const notesApi = {
  list: async (opportunityId: string) => {
    const response = await api.get<ApiResponse<OpportunityNote[]>>(
      `/opportunities/${opportunityId}/notes`,
    );
    return response.data;
  },

  create: async (opportunityId: string, payload: CreateOpportunityNotePayload) => {
    const response = await api.post<ApiResponse<OpportunityNote>>(
      `/opportunities/${opportunityId}/notes`,
      payload,
    );
    return response.data;
  },

  update: async (opportunityId: string, noteId: string, payload: UpdateOpportunityNotePayload) => {
    const response = await api.patch<ApiResponse<OpportunityNote>>(
      `/opportunities/${opportunityId}/notes/${noteId}`,
      payload,
    );
    return response.data;
  },

  remove: async (opportunityId: string, noteId: string) => {
    const response = await api.delete<ApiResponse<null>>(
      `/opportunities/${opportunityId}/notes/${noteId}`,
    );
    return response.data;
  },
};
