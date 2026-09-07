'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { OpportunityNoteForm } from '@/features/opportunities/components/opportunity-notes/opportunity-note-form';
import { useOpportunityNotes } from '@/features/opportunities/hooks/use-opportunity-notes';
import { useUpdateOpportunityNote } from '@/features/opportunities/hooks/use-update-opportunity-note';
import type { OpportunityNoteFormValues } from '@/features/opportunities/schemas/opportunity-note.schema';
import { getErrorMessage } from '@/features/opportunities/utils/opportunity.utils';

export default function OpportunityNoteEditPage() {
  const { id, noteId } = useParams<{ id: string; noteId: string }>();
  const router = useRouter();
  const { notes, isLoading, error, refetch } = useOpportunityNotes(id);
  const { updateNote, isUpdating } = useUpdateOpportunityNote(id, noteId);
  const note = notes.find((item) => item.id === noteId);

  const save = async (values: OpportunityNoteFormValues, files: File[]) => {
    await updateNote({ payload: values, files });
    router.replace(`/opportunities/${id}`);
  };

  if (isLoading) return <LoadingState variant="page" message="Loading note..." />;
  if (error || !note) {
    return (
      <ErrorState
        variant="page"
        title="Unable to load note"
        message={getErrorMessage(error, 'Note not found.')}
        onRetry={() => void refetch()}
        backHref={`/opportunities/${id}`}
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
        title="Edit note"
        initialContent={note.content}
        isSaving={isUpdating}
        onSubmit={save}
        cancelHref={`/opportunities/${id}`}
      />
    </div>
  );
}
