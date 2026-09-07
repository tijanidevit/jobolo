import { useInfiniteQuery } from '@tanstack/react-query';
import { notesApi } from '../api/notes.api';
import { OPPORTUNITY_PAGE_SIZE } from '../constants';

export function opportunityNotesQueryKey(opportunityId: string) {
  return ['opportunities', opportunityId, 'notes'] as const;
}

export function useOpportunityNotes(opportunityId: string, enabled = true) {
  const query = useInfiniteQuery({
    queryKey: opportunityNotesQueryKey(opportunityId),
    queryFn: ({ pageParam }) => notesApi.list(opportunityId, pageParam, OPPORTUNITY_PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.page < lastPage.meta.totalPages ? lastPage.meta.page + 1 : undefined,
    enabled,
  });

  return {
    notes: query.data?.pages.flatMap((page) => page.data) ?? [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    hasNextPage: query.hasNextPage,
    loadMore: query.fetchNextPage,
    isLoadingMore: query.isFetchingNextPage,
  };
}
