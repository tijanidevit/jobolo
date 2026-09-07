import { useMutation, useQueryClient } from '@tanstack/react-query';
import { skillsApi } from '../api/skills.api';
import { skillIntelligenceQueryKey } from './use-skill-intelligence';

export function useUpdateSkillProfile() {
  const queryClient = useQueryClient();
  const mutation = useMutation({ mutationFn: skillsApi.updateProfile, onSuccess: () => queryClient.invalidateQueries({ queryKey: skillIntelligenceQueryKey }) });
  return { updateProfile: mutation.mutateAsync, isUpdating: mutation.isPending, error: mutation.error };
}
