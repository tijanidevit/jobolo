import { useQuery } from '@tanstack/react-query';
import { salaryIntelligenceApi } from '../api/salary-intelligence.api';

export const salaryIntelligenceQueryKey = ['salary-intelligence'] as const;

export function useSalaryIntelligence() {
  const query = useQuery({
    queryKey: salaryIntelligenceQueryKey,
    queryFn: salaryIntelligenceApi.overview,
  });
  return {
    intelligence: query.data?.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
