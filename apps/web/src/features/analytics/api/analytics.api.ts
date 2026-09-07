import type { ApiResponse } from '@jobolo/shared';
import { api } from '@/lib/axios';
import type { AnalyticsOverview } from '../types';

export const analyticsApi = {
  overview: async () => {
    const response = await api.get<ApiResponse<AnalyticsOverview>>('/analytics/overview');
    return response.data;
  },
};
