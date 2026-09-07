import type { ApiResponse } from '@jobolo/shared';
import { api } from '@/lib/axios';
import type { Task, TaskPayload } from '../types';

export const tasksApi = {
  list: async (opportunityId: string) => {
    const response = await api.get<ApiResponse<Task[]>>(`/opportunities/${opportunityId}/tasks`);
    return response.data;
  },
  create: async (opportunityId: string, payload: TaskPayload) => {
    const response = await api.post<ApiResponse<Task>>(`/opportunities/${opportunityId}/tasks`, payload);
    return response.data;
  },
  update: async (opportunityId: string, taskId: string, payload: Partial<TaskPayload>) => {
    const response = await api.patch<ApiResponse<Task>>(`/opportunities/${opportunityId}/tasks/${taskId}`, payload);
    return response.data;
  },
  remove: async (opportunityId: string, taskId: string) => {
    const response = await api.delete<ApiResponse<null>>(`/opportunities/${opportunityId}/tasks/${taskId}`);
    return response.data;
  },
};
