'use client';

import Link from 'next/link';
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
  onSubmit: (values: OpportunityNoteFormValues) => Promise<void>;
  cancelHref: string;
  title: string;
}

export function OpportunityNoteForm({
  initialContent = '',
  isSaving,
  onSubmit,
  cancelHref,
  title,
}: OpportunityNoteFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OpportunityNoteFormValues>({
    resolver: zodResolver(opportunityNoteSchema),
    defaultValues: { content: initialContent },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-slate-500">Keep useful context attached to this opportunity.</p>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <Label htmlFor="note-content">Note</Label>
          <textarea
            id="note-content"
            {...register('content')}
            rows={10}
            placeholder="Capture what you want to remember..."
            className="mt-2 min-h-48 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm leading-6 outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
            disabled={isSaving}
          />
          {errors.content && <p className="mt-2 text-xs text-red-600">{errors.content.message}</p>}
        </CardContent>
        <CardFooter className="justify-end gap-3 border-t border-slate-100 pt-6">
          <Link
            href={cancelHref}
            className="inline-flex h-9 items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </Link>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save note'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
