import { useInfiniteQuery } from '@tanstack/react-query';
import { activitiesApi } from '../api/activities.api';
import { OPPORTUNITY_PAGE_SIZE } from '../constants';

export function opportunityTimelineKey(opportunityId: string) {
  return ['opportunities', opportunityId, 'activities'] as const;
}

export function useOpportunityTimeline(opportunityId: string, enabled = true) {
  const timelineQuery = useInfiniteQuery({
    queryKey: opportunityTimelineKey(opportunityId),
    queryFn: ({ pageParam }) => activitiesApi.list(opportunityId, pageParam, OPPORTUNITY_PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.page < lastPage.meta.totalPages ? lastPage.meta.page + 1 : undefined,
    enabled,
  });

  return {
    activities: timelineQuery.data?.pages.flatMap((page) => page.data) ?? [],
    isLoading: timelineQuery.isLoading,
    error: timelineQuery.error,
    hasNextPage: timelineQuery.hasNextPage,
    loadMore: timelineQuery.fetchNextPage,
    isLoadingMore: timelineQuery.isFetchingNextPage,
  };
}
