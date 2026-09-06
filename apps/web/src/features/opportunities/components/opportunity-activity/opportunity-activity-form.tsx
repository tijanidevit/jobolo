'use client';

import { useState, type FormEvent } from 'react';
import { Loader2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { ACTIVITY_TYPES } from '../../constants';
import type { OpportunityActivity } from '../../types';
import {
  activityFormSchema,
  activityFormValues,
  type ActivityFormValues,
} from '../../utils/activity.utils';

interface OpportunityActivityFormProps {
  activity?: OpportunityActivity;
  isSaving: boolean;
  onSubmit: (values: ActivityFormValues, files: File[]) => Promise<void>;
  onCancel: () => void;
}

export function OpportunityActivityForm({
  activity,
  isSaving,
  onSubmit,
  onCancel,
}: OpportunityActivityFormProps) {
  const [values, setValues] = useState<ActivityFormValues>(() => activityFormValues(activity));
  const [files, setFiles] = useState<File[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);

  const update = <K extends keyof ActivityFormValues>(field: K, value: ActivityFormValues[K]) =>
    setValues((current) => ({ ...current, [field]: value }));
  const addFormat = (format: 'bold' | 'italic' | 'list') => {
    const additions = { bold: '**text**', italic: '_text_', list: '\n- item' };
    update('description', `${values.description}${additions[format]}`);
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = activityFormSchema.safeParse(values);
    if (!result.success) {
      setValidationError(result.error.issues[0]?.message ?? 'Please check the activity details.');
      return;
    }
    setValidationError(null);
    await onSubmit(result.data, files);
  };

  return (
    <form onSubmit={submit} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-800">
          {activity ? 'Edit activity' : 'New activity'}
        </p>
        <button
          type="button"
          onClick={onCancel}
          className="text-slate-400 hover:text-slate-700"
          aria-label="Close activity form"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1.5 text-xs font-medium text-slate-600">
          Type
          <SearchableSelect
            value={values.type}
            options={ACTIVITY_TYPES}
            onChange={(value) => update('type', value)}
            searchPlaceholder="Find activity type..."
          />
        </label>
        <label className="space-y-1.5 text-xs font-medium text-slate-600">
          When
          <Input
            type="datetime-local"
            value={values.occurredAt}
            onChange={(event) => update('occurredAt', event.target.value)}
          />
        </label>
      </div>
      <label className="block space-y-1.5 text-xs font-medium text-slate-600">
        Title
        <Input
          value={values.title}
          onChange={(event) => update('title', event.target.value)}
          placeholder="e.g. Recruiter followed up by email"
        />
      </label>
      <label className="block space-y-1.5 text-xs font-medium text-slate-600">
        Details <span className="font-normal text-slate-400">(optional)</span>
        <div className="flex gap-1 border-b border-slate-200 pb-1">
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
          value={values.description}
          onChange={(event) => update('description', event.target.value)}
          className="min-h-24 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
          placeholder="Capture what happened. Use - item or 1. item for lists."
        />
      </label>
      {!activity && (
        <label className="block space-y-1.5 text-xs font-medium text-slate-600">
          Attachments{' '}
          <span className="font-normal text-slate-400">(optional, up to 5 files / 10 MB each)</span>
          <Input
            type="file"
            multiple
            onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
          />
          {files.length > 0 && (
            <p className="text-xs text-slate-500">{files.map((file) => file.name).join(', ')}</p>
          )}
        </label>
      )}
      {validationError && (
        <p className="text-xs text-red-600" role="alert">
          {validationError}
        </p>
      )}
      <div className="flex justify-end">
        <Button type="submit" size="sm" disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="mr-1.5 h-3.5 w-3.5" />
          )}
          {activity ? 'Save changes' : 'Save activity'}
        </Button>
      </div>
    </form>
  );
}
