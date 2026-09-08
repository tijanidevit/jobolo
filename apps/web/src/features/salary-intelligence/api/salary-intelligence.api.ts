import type { ApiResponse } from '@jobolo/shared';
import { api } from '@/lib/axios';
import type { SalaryIntelligence } from '../types';

export const salaryIntelligenceApi = {
  overview: async () =>
    (await api.get<ApiResponse<SalaryIntelligence>>('/salary-intelligence')).data,
};
