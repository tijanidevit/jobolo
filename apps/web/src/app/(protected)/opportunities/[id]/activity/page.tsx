'use client';

import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { OpportunityTimeline } from '@/features/opportunities/components/opportunity-activity/opportunity-timeline';

export default function OpportunityActivityPage() {
  const { id } = useParams<{ id: string }>();
  return (
    <Card>
      <OpportunityTimeline opportunityId={id} />
    </Card>
  );
}
