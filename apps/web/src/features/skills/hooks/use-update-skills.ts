import { useMutation, useQueryClient } from '@tanstack/react-query';
import { skillsApi } from '../api/skills.api';
import { skillIntelligenceQueryKey } from './use-skill-intelligence';

export function useUpdateSkills() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: skillsApi.updateSkills,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: skillIntelligenceQueryKey }),
  });

  return {
    updateSkills: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    error: mutation.error,
  };
}
