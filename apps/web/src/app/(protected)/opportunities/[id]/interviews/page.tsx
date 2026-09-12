'use client';

import { useParams } from 'next/navigation';
import { InterviewList } from '@/features/interviews/components/interview-list';

export default function OpportunityInterviewsPage() {
  const { id } = useParams<{ id: string }>();
  return <InterviewList opportunityId={id} />;
}
