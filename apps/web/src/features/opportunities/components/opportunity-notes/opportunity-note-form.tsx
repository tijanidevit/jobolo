'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  opportunityNoteSchema,
  type OpportunityNoteFormValues,
} from '../../schemas/opportunity-note.schema';

interface OpportunityNoteFormProps {
  initialContent?: string;
  isSaving: boolean;
  onSubmit: (values: OpportunityNoteFormValues, files: File[]) => Promise<void>;
  cancelHref?: string;
  onCancel?: () => void;
  title: string;
}

export function OpportunityNoteForm({
  initialContent = '',
  isSaving,
  onSubmit,
  cancelHref,
  onCancel,
  title,
}: OpportunityNoteFormProps) {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<OpportunityNoteFormValues>({
    resolver: zodResolver(opportunityNoteSchema),
    defaultValues: { content: initialContent },
  });
  const [files, setFiles] = useState<File[]>([]);
  const addFormat = (format: 'bold' | 'italic' | 'list') => {
    const additions = { bold: '**text**', italic: '_text_', list: '\n- item' };
    setValue('content', `${getValues('content')}${additions[format]}`, { shouldDirty: true });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-slate-500">Keep useful context attached to this opportunity.</p>
      </CardHeader>
      <form onSubmit={handleSubmit((values) => onSubmit(values, files))}>
        <CardContent>
          <Label htmlFor="note-content">Note</Label>
          <div className="mt-2 flex gap-1 border-b border-slate-200 pb-1">
            <button
              type="button"
              onClick={() => addFormat('bold')}
              className="rounded px-2 py-1 text-xs font-bold text-slate-500 hover:bg-slate-100"
            >
              B
            </button>
            <button
              type="button"
              onClick={() => addFormat('italic')}
              className="rounded px-2 py-1 text-xs italic text-slate-500 hover:bg-slate-100"
            >
              I
            </button>
            <button
              type="button"
              onClick={() => addFormat('list')}
              className="rounded px-2 py-1 text-xs text-slate-500 hover:bg-slate-100"
            >
              List
            </button>
          </div>
          <textarea
            id="note-content"
            {...register('content')}
            rows={10}
            placeholder="Capture what you want to remember..."
            className="min-h-48 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm leading-6 outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
            disabled={isSaving}
          />
          {errors.content && <p className="mt-2 text-xs text-red-600">{errors.content.message}</p>}
          <p className="mt-2 text-xs text-slate-400">Supports bold, italic, and simple lists.</p>
          <label className="mt-4 block text-sm font-medium text-slate-700">
            Attachments
            <span className="ml-1 font-normal text-slate-400">(up to 5 files, 10 MB each)</span>
            <input
              type="file"
              multiple
              onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
              className="mt-2 block w-full text-sm text-slate-500"
              disabled={isSaving}
            />
          </label>
          {files.length > 0 && (
            <p className="mt-2 text-xs text-slate-500">{files.map((file) => file.name).join(', ')}</p>
          )}
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
              href={cancelHref ?? '#'}
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
