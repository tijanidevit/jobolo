import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resumesApi } from '../api/resumes.api';
import { resumesQueryKey } from './use-resumes';

export function useDeleteResume() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: resumesApi.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: resumesQueryKey }),
  });

  return {
    deleteResume: mutation.mutateAsync,
    isDeleting: mutation.isPending,
  };
}
