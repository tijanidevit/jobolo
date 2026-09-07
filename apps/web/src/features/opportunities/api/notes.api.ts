import type { ApiResponse } from '@jobolo/shared';
import { api } from '@/lib/axios';
import type { OpportunityNote } from '../types';
import { OPPORTUNITY_PAGE_SIZE } from '../constants';
import type { PaginationMeta } from '@jobolo/shared';

type OpportunityNotePage = ApiResponse<OpportunityNote[]> & { meta: PaginationMeta };

export interface CreateOpportunityNotePayload {
  content: string;
}

export type UpdateOpportunityNotePayload = Partial<CreateOpportunityNotePayload>;

function noteFormData(payload: CreateOpportunityNotePayload, files: File[]) {
  const formData = new FormData();
  formData.append('content', payload.content);
  files.forEach((file) => formData.append('files', file));
  return formData;
}

export const notesApi = {
  list: async (opportunityId: string, page = 1, limit = OPPORTUNITY_PAGE_SIZE) => {
    const response = await api.get<OpportunityNotePage>(
      `/opportunities/${opportunityId}/notes`,
      { params: { page, limit } },
    );
    return response.data;
  },

  create: async (opportunityId: string, payload: CreateOpportunityNotePayload, files: File[] = []) => {
    const response = await api.post<ApiResponse<OpportunityNote>>(
      `/opportunities/${opportunityId}/notes`,
      noteFormData(payload, files),
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return response.data;
  },

  update: async (
    opportunityId: string,
    noteId: string,
    payload: UpdateOpportunityNotePayload,
    files: File[] = [],
  ) => {
    const formData = new FormData();
    if (payload.content !== undefined) formData.append('content', payload.content);
    files.forEach((file) => formData.append('files', file));
    const response = await api.patch<ApiResponse<OpportunityNote>>(
      `/opportunities/${opportunityId}/notes/${noteId}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return response.data;
  },

  downloadAttachment: async (opportunityId: string, noteId: string, storedName: string) => {
    const response = await api.get<Blob>(
      `/opportunities/${opportunityId}/notes/${noteId}/attachments/${storedName}`,
      { responseType: 'blob' },
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
