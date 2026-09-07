import { useMutation, useQueryClient } from '@tanstack/react-query';
import { activitiesApi, type UpdateActivityPayload } from '../api/activities.api';
import { opportunityTimelineKey } from './use-opportunity-timeline';

export function useUpdateOpportunityActivity(opportunityId: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({
      activityId,
      payload,
      files,
    }: {
      activityId: string;
      payload: UpdateActivityPayload;
      files?: File[];
    }) => activitiesApi.update(opportunityId, activityId, payload, files),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: opportunityTimelineKey(opportunityId) }),
  });

  return { updateActivity: mutation.mutateAsync, isUpdating: mutation.isPending };
}
