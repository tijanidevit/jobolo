import { useQuery } from '@tanstack/react-query';
import { skillsApi } from '../api/skills.api';
import type { SkillSort } from '../api/skills.api';

export const skillIntelligenceQueryKey = ['skills', 'intelligence'] as const;

export function useSkillIntelligence(sort: SkillSort) {
  const query = useQuery({
    queryKey: [...skillIntelligenceQueryKey, sort],
    queryFn: () => skillsApi.intelligence(sort),
  });
  return {
    intelligence: query.data?.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
