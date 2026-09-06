import { useQuery } from '@tanstack/react-query';
import { activitiesApi } from '../api/activities.api';

export function opportunityTimelineKey(opportunityId: string) {
  return ['opportunities', opportunityId, 'activities'] as const;
}

export function useOpportunityTimeline(opportunityId: string, enabled = true) {
  const timelineQuery = useQuery({
    queryKey: opportunityTimelineKey(opportunityId),
    queryFn: () => activitiesApi.list(opportunityId),
    enabled,
  });
  return {
    activities: timelineQuery.data?.data ?? [],
    isLoading: timelineQuery.isLoading,
    error: timelineQuery.error,
  };
}
