import { useMutation } from '@tanstack/react-query';
import { resumesApi } from '../api/resumes.api';

export function useDownloadResume() {
  const mutation = useMutation({ mutationFn: resumesApi.download });

  return {
    downloadResume: mutation.mutateAsync,
    downloadingId: mutation.isPending ? mutation.variables : null,
  };
}
