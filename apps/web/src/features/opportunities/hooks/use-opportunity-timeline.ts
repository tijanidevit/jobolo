import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { activitiesApi, type CreateActivityPayload, type UpdateActivityPayload } from '../api/activities.api';

export function opportunityTimelineKey(opportunityId: string) {
  return ['opportunities', opportunityId, 'activities'] as const;
}

export function useOpportunityTimeline(opportunityId: string, enabled: boolean) {
  const queryClient = useQueryClient();
  const timelineQuery = useQuery({
    queryKey: opportunityTimelineKey(opportunityId),
    queryFn: () => activitiesApi.list(opportunityId),
    enabled,
  });
  const createMutation = useMutation({
    mutationFn: ({ payload, files }: { payload: CreateActivityPayload; files?: File[] }) => activitiesApi.create(opportunityId, payload, files),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: opportunityTimelineKey(opportunityId) }),
  });
  const updateMutation = useMutation({
    mutationFn: ({ activityId, payload }: { activityId: string; payload: UpdateActivityPayload }) => activitiesApi.update(opportunityId, activityId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: opportunityTimelineKey(opportunityId) }),
  });

  return {
    activities: timelineQuery.data?.data ?? [],
    isLoading: timelineQuery.isLoading,
    error: timelineQuery.error,
    createActivity: createMutation.mutateAsync,
    updateActivity: updateMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
  };
}
