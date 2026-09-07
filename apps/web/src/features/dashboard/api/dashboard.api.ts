import type { ApiResponse } from '@jobolo/shared';
import { api } from '@/lib/axios';
import type { TodayDashboardData } from '../types';

export const dashboardApi = {
  today: async () => {
    const response = await api.get<ApiResponse<TodayDashboardData>>('/dashboard/today');
    return response.data;
  },
};
