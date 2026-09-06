'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { OpportunityNoteForm } from '@/features/opportunities/components/opportunity-notes/opportunity-note-form';
import { useCreateOpportunityNote } from '@/features/opportunities/hooks/use-create-opportunity-note';
import { useOpportunity } from '@/features/opportunities/hooks/use-opportunity';
import type { OpportunityNoteFormValues } from '@/features/opportunities/schemas/opportunity-note.schema';
import { getErrorMessage, isNotFoundError } from '@/features/opportunities/utils/opportunity.utils';

export default function OpportunityNoteCreatePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { opportunity, isLoading, error, refetch } = useOpportunity(id);
  const { createNote, isCreating } = useCreateOpportunityNote(id);

  const save = async (values: OpportunityNoteFormValues) => {
    await createNote(values);
    router.replace(`/opportunities/${id}`);
  };

  if (isLoading) return <LoadingState variant="page" message="Loading opportunity..." />;
  if (error || !opportunity) {
    const notFound = !opportunity || isNotFoundError(error);
    return (
      <ErrorState
        variant="page"
        title="Unable to load opportunity"
        message={notFound ? 'Opportunity not found.' : getErrorMessage(error, 'This opportunity could not be loaded.')}
        onRetry={() => void refetch()}
        backHref="/opportunities"
      />
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href={`/opportunities/${id}`} className="mb-5 inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to opportunity
      </Link>
      <OpportunityNoteForm
        title="Add note"
        isSaving={isCreating}
        onSubmit={save}
        cancelHref={`/opportunities/${id}`}
      />
    </div>
  );
}
