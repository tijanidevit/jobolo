import { useQuery } from '@tanstack/react-query';
import { careerIntelligenceApi } from '../api/career-intelligence.api';

export const careerIntelligenceQueryKey = ['career-intelligence'] as const;

export function useCareerIntelligence() {
  const query = useQuery({
    queryKey: careerIntelligenceQueryKey,
    queryFn: careerIntelligenceApi.overview,
  });

  return {
    intelligence: query.data?.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
