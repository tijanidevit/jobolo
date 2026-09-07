import type { Interview } from '@/features/interviews/types';
import type { Opportunity } from '@/features/opportunities/types';
import type { Task } from '@/features/tasks/types';

export interface TodayDashboardData {
  priorities: {
    overdueTasks: Task[];
    dueTodayTasks: Task[];
    upcomingInterviews: Interview[];
  };
  activeOpportunities: Opportunity[];
  metrics: {
    applications: number;
    interviews: number;
    finalRounds: number;
    offers: number;
    applicationsThisWeek: number;
  };
}
