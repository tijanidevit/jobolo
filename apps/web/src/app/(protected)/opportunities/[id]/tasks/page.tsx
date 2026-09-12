'use client';

import { useParams } from 'next/navigation';
import { TaskList } from '@/features/tasks/components/task-list';
import { OpportunityNextAction } from '@/features/opportunities/components/opportunity-detail/opportunity-next-action';
import { useOpportunity } from '@/features/opportunities/hooks/use-opportunity';

export default function OpportunityTasksPage() {
  const { id } = useParams<{ id: string }>();
  const { opportunity } = useOpportunity(id);
  if (!opportunity) return null;
  return (
    <div className="space-y-6">
      <OpportunityNextAction opportunity={opportunity} />
      <TaskList opportunityId={id} />
    </div>
  );
}
