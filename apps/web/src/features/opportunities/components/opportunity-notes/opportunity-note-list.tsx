'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FileText, Pencil, Plus, Trash2 } from 'lucide-react';
import { AttachmentDownloadButton } from '@/components/ui/attachment';
import { Button } from '@/components/ui/button';
import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { useDeleteOpportunityNote } from '../../hooks/use-delete-opportunity-note';
import { useOpportunityNotes } from '../../hooks/use-opportunity-notes';
import { notesApi } from '../../api/notes.api';
import type { OpportunityNote } from '../../types';
import { OpportunityNoteForm } from './opportunity-note-form';
import { RichText } from '@/components/ui/rich-text';
import { formatDate, getErrorMessage } from '../../utils/opportunity.utils';

export function OpportunityNoteList({ opportunityId }: { opportunityId: string }) {
  const [editingNote, setEditingNote] = useState<OpportunityNote | null>(null);
  const { notes, isLoading, error, refetch, hasNextPage, loadMore, isLoadingMore } =
    useOpportunityNotes(opportunityId);
  const { deleteNote, isDeleting } = useDeleteOpportunityNote(opportunityId);

  const removeNote = async (note: OpportunityNote) => {
    if (!window.confirm('Delete this note?')) return;
    await deleteNote(note.id).catch(() => undefined);
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-600" />
            <h2 className="text-base font-semibold text-slate-900">Notes</h2>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Private context to remember about this role.
          </p>
        </div>
        <Link
          href={`/opportunities/${opportunityId}/notes/create`}
          className="inline-flex h-8 items-center rounded-md bg-blue-600 px-3 text-xs font-medium text-white hover:bg-blue-700"
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Add note
        </Link>
      </div>

      {editingNote && (
        <div className="mt-5">
          <OpportunityNoteForm
            key={editingNote.id}
            opportunityId={opportunityId}
            note={editingNote}
            onCancel={() => setEditingNote(null)}
          />
        </div>
      )}

      {isLoading && <LoadingState message="Loading notes..." className="py-8" />}
      {error && (
        <ErrorState
          message={getErrorMessage(error, 'We could not load your notes.')}
          onRetry={() => void refetch()}
          className="mt-4"
        />
      )}
      {!isLoading && !error && notes.length === 0 && (
        <div className="mt-5 rounded-lg border border-dashed border-slate-200 px-4 py-8 text-center">
          <p className="text-sm font-medium text-slate-700">No notes yet</p>
          <p className="mt-1 text-xs text-slate-500">
            Capture the first useful detail about this opportunity.
          </p>
        </div>
      )}
      {!isLoading && !error && notes.length > 0 && (
        <div className="mt-5 space-y-3">
          {notes.map((note) => (
            <article
              key={note.id}
              className="rounded-lg border border-slate-200 bg-slate-50/70 p-4"
            >
              <RichText text={note.content} />
              {note.attachments?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {note.attachments.map((attachment) => (
                    <AttachmentDownloadButton
                      key={attachment.id}
                      fileName={attachment.originalName}
                      onDownload={() =>
                        notesApi.downloadAttachment(opportunityId, note.id, attachment.storedName)
                      }
                    />
                  ))}
                </div>
              )}
              <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-200 pt-3">
                <time className="text-xs text-slate-400" dateTime={note.updatedAt}>
                  Updated {formatDate(note.updatedAt)}
                </time>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setEditingNote(note)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-white hover:text-slate-900"
                    aria-label="Edit note"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => void removeNote(note)}
                    disabled={isDeleting}
                    aria-label="Delete note"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-red-500" />
                  </Button>
                </div>
              </div>
            </article>
          ))}
          {hasNextPage && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => void loadMore()}
              disabled={isLoadingMore}
            >
              {isLoadingMore ? 'Loading more...' : 'Load more notes'}
            </Button>
          )}
        </div>
      )}
    </section>
  );
}
