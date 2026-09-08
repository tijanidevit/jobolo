import type { ApiResponse } from '@jobolo/shared';
import { api } from '@/lib/axios';
import type { Resume, ResumePayload } from '../types';

export const resumesApi = {
  list: async () => (await api.get<ApiResponse<Resume[]>>('/resumes')).data,
  create: async (payload: ResumePayload, file: File) => {
    const formData = new FormData();
    formData.append('name', payload.name);
    formData.append('file', file);
    return (await api.post<ApiResponse<Resume>>('/resumes', formData)).data;
  },
  update: async (id: string, payload: Partial<ResumePayload>) =>
    (await api.patch<ApiResponse<Resume>>(`/resumes/${id}`, payload)).data,
  remove: async (id: string) => (await api.delete<ApiResponse<null>>(`/resumes/${id}`)).data,
  download: async (id: string) =>
    (await api.get<Blob>(`/resumes/${id}/file`, { responseType: 'blob' })).data,
};
