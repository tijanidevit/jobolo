import type { ApiResponse } from '@jobolo/shared';
import { api } from '@/lib/axios';
import type { JobSearchPulse } from '../types';

export const jobSearchPulseApi = {
  overview: async () => (await api.get<ApiResponse<JobSearchPulse>>('/analytics/pulse')).data,
};
