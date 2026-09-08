import type { ApiResponse } from '@jobolo/shared';
import { api } from '@/lib/axios';
import type { InsightsResponse } from '../types';

export const insightsApi = {
  overview: async () => (await api.get<ApiResponse<InsightsResponse>>('/insights')).data,
};
