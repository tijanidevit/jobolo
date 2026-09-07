'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AttachmentPicker } from '@/components/ui/attachment';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { useCreateOpportunityNote } from '../../hooks/use-create-opportunity-note';
import { useUpdateOpportunityNote } from '../../hooks/use-update-opportunity-note';
import type { OpportunityNote } from '../../types';
import {
  opportunityNoteSchema,
  type OpportunityNoteFormValues,
} from '../../schemas/opportunity-note.schema';

interface OpportunityNoteFormProps {
  opportunityId: string;
  note?: OpportunityNote;
  onCancel?: () => void;
}

export function OpportunityNoteForm({ opportunityId, note, onCancel }: OpportunityNoteFormProps) {
  const router = useRouter();
  const { createNote, isCreating } = useCreateOpportunityNote(opportunityId);
  const { updateNote, isUpdating } = useUpdateOpportunityNote(opportunityId, note?.id ?? '');
  const isSaving = isCreating || isUpdating;
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OpportunityNoteFormValues>({
    resolver: zodResolver(opportunityNoteSchema),
    defaultValues: { content: note?.content ?? '' },
  });
  const [files, setFiles] = useState<File[]>([]);
  const submit = async (values: OpportunityNoteFormValues) => {
    if (note) await updateNote({ payload: values, files });
    else await createNote({ payload: values, files });

    if (onCancel) onCancel();
    else router.replace(`/opportunities/${opportunityId}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{note ? 'Edit note' : 'Add note'}</CardTitle>
        <p className="text-sm text-slate-500">Keep useful context attached to this opportunity.</p>
      </CardHeader>
      <form onSubmit={handleSubmit(submit)}>
        <CardContent>
          <Label htmlFor="note-content">Note</Label>
          <Controller
            control={control}
            name="content"
            render={({ field }) => (
              <RichTextEditor
                id="note-content"
                value={field.value}
                onChange={field.onChange}
                rows={10}
                placeholder="Capture what you want to remember..."
                disabled={isSaving}
              />
            )}
          />
          {errors.content && <p className="mt-2 text-xs text-red-600">{errors.content.message}</p>}
          <p className="mt-2 text-xs text-slate-400">Supports bold, italic, and simple lists.</p>
          <label className="mt-4 block text-sm font-medium text-slate-700">
            Attachments
            <span className="ml-1 font-normal text-slate-400">(up to 5 files, 10 MB each)</span>
            <AttachmentPicker files={files} onChange={setFiles} disabled={isSaving} />
          </label>
        </CardContent>
        <CardFooter className="justify-end gap-3 border-t border-slate-100 pt-6">
          {onCancel ? (
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex h-9 items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
          ) : (
            <Link
              href={`/opportunities/${opportunityId}`}
              className="inline-flex h-9 items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </Link>
          )}
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save note'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
