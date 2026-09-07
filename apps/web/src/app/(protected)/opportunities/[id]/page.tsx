'use client';

import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { useOpportunity } from '@/features/opportunities/hooks/use-opportunity';
import { getErrorMessage, isNotFoundError } from '@/features/opportunities/utils/opportunity.utils';
import { OpportunityDetailHeader } from '@/features/opportunities/components/opportunity-detail/opportunity-detail-header';
import { OpportunityDetailSections } from '@/features/opportunities/components/opportunity-detail/opportunity-detail-sections';
import { OpportunityTimeline } from '@/features/opportunities/components/opportunity-activity/opportunity-timeline';
import { OpportunityNoteList } from '@/features/opportunities/components/opportunity-notes/opportunity-note-list';
import { ContactList } from '@/features/contacts/components/contact-list';
import { InterviewList } from '@/features/interviews/components/interview-list';
import { TaskList } from '@/features/tasks/components/task-list';
import { OpportunityNextAction } from '@/features/opportunities/components/opportunity-detail/opportunity-next-action';

export default function OpportunityDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { opportunity, isLoading, error, refetch } = useOpportunity(id);

  if (isLoading) return <LoadingState variant="page" message="Loading opportunity..." />;
  if (error || !opportunity) {
    const notFound = !opportunity || isNotFoundError(error);
    return (
      <ErrorState
        variant="page"
        title="Unable to load opportunity"
        message={
          notFound
            ? 'Opportunity not found.'
            : getErrorMessage(error, 'This opportunity could not be loaded.')
        }
        onRetry={() => void refetch()}
        backHref="/opportunities"
      />
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <OpportunityDetailHeader opportunity={opportunity} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(19rem,0.72fr)]">
        <div className="space-y-6">
          <OpportunityDetailSections opportunity={opportunity} />
          <OpportunityNextAction opportunity={opportunity} />
          <ContactList opportunityId={opportunity.id} />
          <InterviewList opportunityId={opportunity.id} />
          <TaskList opportunityId={opportunity.id} />
        </div>

        <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <Card>
            <OpportunityTimeline opportunityId={opportunity.id} />
          </Card>
          <OpportunityNoteList opportunityId={opportunity.id} />
        </div>
      </div>
    </div>
  );
}
