import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resumesApi } from '../api/resumes.api';
import { resumesQueryKey } from './use-resumes';

export function useUpdateResume() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => resumesApi.update(id, { name }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: resumesQueryKey }),
  });

  return {
    updateResume: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    error: mutation.error,
  };
}
