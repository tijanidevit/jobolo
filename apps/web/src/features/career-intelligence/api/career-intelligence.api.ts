import type { ApiResponse } from '@jobolo/shared';
import { api } from '@/lib/axios';
import type { CareerIntelligence } from '../types';

export const careerIntelligenceApi = {
  overview: async () =>
    (await api.get<ApiResponse<CareerIntelligence>>('/analytics/career-intelligence')).data,
};
