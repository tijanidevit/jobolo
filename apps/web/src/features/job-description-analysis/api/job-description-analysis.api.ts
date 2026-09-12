import type { ApiResponse } from '@jobolo/shared';
import { api } from '@/lib/axios';
import type { JobDescriptionAnalysis } from '../types';

export const jobDescriptionAnalysisApi = {
  analyze: async (input: { description?: string; jobUrl?: string }) =>
    (
      await api.post<ApiResponse<JobDescriptionAnalysis>>('/job-description-analysis', {
        ...input,
      })
    ).data,
};
