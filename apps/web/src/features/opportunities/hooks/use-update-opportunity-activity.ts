import { useMutation, useQueryClient } from '@tanstack/react-query';
import { activitiesApi, type UpdateActivityPayload } from '../api/activities.api';
import { opportunityTimelineKey } from './use-opportunity-timeline';

export function useUpdateOpportunityActivity(opportunityId: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ activityId, payload }: { activityId: string; payload: UpdateActivityPayload }) =>
      activitiesApi.update(opportunityId, activityId, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: opportunityTimelineKey(opportunityId) }),
  });

  return { updateActivity: mutation.mutateAsync, isUpdating: mutation.isPending };
}
