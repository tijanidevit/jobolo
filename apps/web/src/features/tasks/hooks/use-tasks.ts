import { useQuery } from '@tanstack/react-query';
import { tasksApi } from '../api/tasks.api';

export function tasksQueryKey(opportunityId: string) {
  return ['opportunities', opportunityId, 'tasks'] as const;
}

export function useTasks(opportunityId: string) {
  const query = useQuery({
    queryKey: tasksQueryKey(opportunityId),
    queryFn: () => tasksApi.list(opportunityId),
  });

  return {
    tasks: query.data?.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
