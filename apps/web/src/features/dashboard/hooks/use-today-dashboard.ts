import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard.api';

export const todayDashboardQueryKey = ['dashboard', 'today'] as const;

export function useTodayDashboard() {
  const query = useQuery({
    queryKey: todayDashboardQueryKey,
    queryFn: dashboardApi.today,
  });

  return {
    dashboard: query.data?.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
