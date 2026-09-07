'use client';

import { useState, type FormEvent } from 'react';
import { Loader2, Save, X } from 'lucide-react';
import { AttachmentPicker } from '@/components/ui/attachment';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { ACTIVITY_TYPES } from '../../constants';
import { useCreateOpportunityActivity } from '../../hooks/use-create-opportunity-activity';
import { useUpdateOpportunityActivity } from '../../hooks/use-update-opportunity-activity';
import type { OpportunityActivity } from '../../types';
import {
  activityFormSchema,
  activityFormValues,
  type ActivityFormValues,
} from '../../utils/activity.utils';

interface OpportunityActivityFormProps {
  opportunityId: string;
  activity?: OpportunityActivity;
  onCancel: () => void;
}

export function OpportunityActivityForm({
  opportunityId,
  activity,
  onCancel,
}: OpportunityActivityFormProps) {
  const { createActivity, isCreating } = useCreateOpportunityActivity(opportunityId);
  const { updateActivity, isUpdating } = useUpdateOpportunityActivity(opportunityId);
  const isSaving = isCreating || isUpdating;
  const [values, setValues] = useState<ActivityFormValues>(() => activityFormValues(activity));
  const [files, setFiles] = useState<File[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);

  const update = <K extends keyof ActivityFormValues>(field: K, value: ActivityFormValues[K]) =>
    setValues((current) => ({ ...current, [field]: value }));
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = activityFormSchema.safeParse(values);
    if (!result.success) {
      setValidationError(result.error.issues[0]?.message ?? 'Please check the activity details.');
      return;
    }
    setValidationError(null);
    const payload = {
      ...result.data,
      type: result.data.type as OpportunityActivity['type'],
      occurredAt: new Date(result.data.occurredAt).toISOString(),
    };
    if (activity) await updateActivity({ activityId: activity.id, payload, files });
    else await createActivity({ payload, files });
    onCancel();
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
        <RichTextEditor
          id="activity-details"
          value={values.description}
          onChange={(value) => update('description', value)}
          disabled={isSaving}
          placeholder="Capture what happened. Use - item or 1. item for lists."
        />
      </label>
      <label className="block space-y-1.5 text-xs font-medium text-slate-600">
        Attachments{' '}
        <span className="font-normal text-slate-400">
          (optional, up to 5 new files / 10 MB each)
        </span>
        <AttachmentPicker files={files} onChange={setFiles} disabled={isSaving} />
      </label>
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
