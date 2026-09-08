import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resumesApi } from '../api/resumes.api';
import { resumesQueryKey } from './use-resumes';

export function useCreateResume() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ name, file }: { name: string; file: File }) => resumesApi.create({ name }, file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: resumesQueryKey }),
  });

  return {
    createResume: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error,
  };
}
