import { useMutation, useQueryClient } from '@tanstack/react-query';
import { interviewsApi } from '../api/interviews.api';
import { interviewsQueryKey } from './use-interviews';
import type { InterviewPayload } from '../types';

export function useUpdateInterview(opportunityId: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({
      interviewId,
      payload,
    }: {
      interviewId: string;
      payload: Partial<InterviewPayload>;
    }) => interviewsApi.update(opportunityId, interviewId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: interviewsQueryKey(opportunityId) }),
  });

  return { updateInterview: mutation.mutateAsync, isUpdating: mutation.isPending };
}
