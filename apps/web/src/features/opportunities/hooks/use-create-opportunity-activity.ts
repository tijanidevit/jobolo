import { useMutation, useQueryClient } from '@tanstack/react-query';
import { activitiesApi, type CreateActivityPayload } from '../api/activities.api';
import { opportunityTimelineKey } from './use-opportunity-timeline';

export function useCreateOpportunityActivity(opportunityId: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ payload, files }: { payload: CreateActivityPayload; files?: File[] }) =>
      activitiesApi.create(opportunityId, payload, files),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: opportunityTimelineKey(opportunityId) }),
  });

  return { createActivity: mutation.mutateAsync, isCreating: mutation.isPending };
}
