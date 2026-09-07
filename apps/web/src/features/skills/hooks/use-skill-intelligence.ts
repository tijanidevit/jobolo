import { useQuery } from '@tanstack/react-query';
import { skillsApi } from '../api/skills.api';

export const skillIntelligenceQueryKey = ['skills', 'intelligence'] as const;

export function useSkillIntelligence() {
  const query = useQuery({ queryKey: skillIntelligenceQueryKey, queryFn: skillsApi.intelligence });
  return {
    intelligence: query.data?.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
