import { useMutation, useQueryClient } from '@tanstack/react-query';
import { interviewsApi } from '../api/interviews.api';
import { interviewsQueryKey } from './use-interviews';

export function useDeleteInterview(opportunityId: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (interviewId: string) => interviewsApi.remove(opportunityId, interviewId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: interviewsQueryKey(opportunityId) }),
  });

  return { deleteInterview: mutation.mutateAsync, isDeleting: mutation.isPending };
}
