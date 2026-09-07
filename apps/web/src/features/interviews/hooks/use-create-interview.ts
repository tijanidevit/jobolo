import { useMutation, useQueryClient } from '@tanstack/react-query';
import { interviewsApi } from '../api/interviews.api';
import { interviewsQueryKey } from './use-interviews';
import type { InterviewPayload } from '../types';

export function useCreateInterview(opportunityId: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (payload: InterviewPayload) => interviewsApi.create(opportunityId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: interviewsQueryKey(opportunityId) }),
  });

  return { createInterview: mutation.mutateAsync, isCreating: mutation.isPending };
}
