import type { ApiResponse } from '@jobolo/shared';
import { api } from '@/lib/axios';
import type { InterviewMemory, InterviewPreparation, OpportunityFitScore } from '../types';

const basePath = (opportunityId: string) => `/opportunities/${opportunityId}/ai`;

export const aiIntelligenceApi = {
  getFitScore: async (opportunityId: string) =>
    (await api.get<ApiResponse<OpportunityFitScore | null>>(`${basePath(opportunityId)}/fit-score`))
      .data,
  generateFitScore: async (opportunityId: string) =>
    (await api.post<ApiResponse<OpportunityFitScore>>(`${basePath(opportunityId)}/fit-score`)).data,
  getPreparation: async (opportunityId: string) =>
    (
      await api.get<ApiResponse<InterviewPreparation | null>>(
        `${basePath(opportunityId)}/interview-preparation`,
      )
    ).data,
  generatePreparation: async (opportunityId: string) =>
    (
      await api.post<ApiResponse<InterviewPreparation>>(
        `${basePath(opportunityId)}/interview-preparation`,
      )
    ).data,
  getMemory: async (opportunityId: string, interviewId: string) =>
    (
      await api.get<ApiResponse<InterviewMemory | null>>(
        `${basePath(opportunityId)}/interviews/${interviewId}/memory`,
      )
    ).data,
  createMemory: async (opportunityId: string, interviewId: string, sourceText: string) =>
    (
      await api.post<ApiResponse<InterviewMemory>>(
        `${basePath(opportunityId)}/interviews/${interviewId}/memory`,
        { sourceText },
      )
    ).data,
};
