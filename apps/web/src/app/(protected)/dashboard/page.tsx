'use client';

import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { ActiveOpportunities } from '@/features/dashboard/components/today-dashboard/active-opportunities';
import { DashboardHeader } from '@/features/dashboard/components/today-dashboard/dashboard-header';
import { DashboardMetrics } from '@/features/dashboard/components/today-dashboard/dashboard-metrics';
import { DashboardPriorities } from '@/features/dashboard/components/today-dashboard/dashboard-priorities';
import { useTodayDashboard } from '@/features/dashboard/hooks/use-today-dashboard';

export default function DashboardPage() {
  const { user } = useAuth();
  const { dashboard, isLoading, error, refetch } = useTodayDashboard();

  if (isLoading) return <LoadingState variant="page" message="Loading today..." />;
  if (error || !dashboard) {
    return (
      <ErrorState
        variant="page"
        title="Unable to load today"
        message="Your priorities could not be loaded."
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <DashboardHeader firstName={user?.firstName} />
      <DashboardMetrics metrics={dashboard.metrics} />
      <DashboardPriorities priorities={dashboard.priorities} />
      <ActiveOpportunities opportunities={dashboard.activeOpportunities} />
    </div>
  );
}
