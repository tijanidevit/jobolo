import type { ApiResponse } from '@jobolo/shared';
import { api } from '@/lib/axios';
import type { CoverLetter, CoverLetterPayload } from '../types';

export const coverLettersApi = {
  list: async () => (await api.get<ApiResponse<CoverLetter[]>>('/cover-letters')).data,
  create: async (payload: CoverLetterPayload, file: File) => {
    const formData = new FormData();
    formData.append('name', payload.name);
    formData.append('style', payload.style);
    if (payload.template) formData.append('template', payload.template);
    formData.append('file', file);
    return (await api.post<ApiResponse<CoverLetter>>('/cover-letters', formData)).data;
  },
  update: async (id: string, payload: Partial<CoverLetterPayload>) =>
    (await api.patch<ApiResponse<CoverLetter>>(`/cover-letters/${id}`, payload)).data,
  remove: async (id: string) => (await api.delete<ApiResponse<null>>(`/cover-letters/${id}`)).data,
  download: async (id: string) =>
    (await api.get<Blob>(`/cover-letters/${id}/file`, { responseType: 'blob' })).data,
};
