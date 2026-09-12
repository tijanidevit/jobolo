'use client';

import { useParams } from 'next/navigation';
import { OpportunityNoteList } from '@/features/opportunities/components/opportunity-notes/opportunity-note-list';

export default function OpportunityNotesPage() {
  const { id } = useParams<{ id: string }>();
  return <OpportunityNoteList opportunityId={id} />;
}
