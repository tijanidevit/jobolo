'use client';

import { useState, type FormEvent } from 'react';
import { Loader2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { useCreateInterview } from '../hooks/use-create-interview';
import { useUpdateInterview } from '../hooks/use-update-interview';
import { interviewSchema, type InterviewFormValues } from '../schemas/interview.schema';
import { INTERVIEW_TYPES, type Interview } from '../types';

const interviewTypeOptions = INTERVIEW_TYPES.map((type) => ({ value: type, label: type }));

function toDateTimeLocal(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function initialValues(interview?: Interview): InterviewFormValues {
  return {
    type: interview?.type ?? '',
    scheduledAt: toDateTimeLocal(interview?.scheduledAt),
    durationMinutes: interview?.durationMinutes?.toString() ?? '',
    interviewers: interview?.interviewers ?? '',
    meetingLocation: interview?.meetingLocation ?? '',
    stage: interview?.stage ?? '',
    notes: interview?.notes ?? '',
    performanceRating: interview?.performanceRating?.toString() ?? '',
  };
}

export function InterviewForm({
  opportunityId,
  interview,
  onCancel,
}: {
  opportunityId: string;
  interview?: Interview;
  onCancel: () => void;
}) {
  const { createInterview, isCreating } = useCreateInterview(opportunityId);
  const { updateInterview, isUpdating } = useUpdateInterview(opportunityId);
  const [values, setValues] = useState(() => initialValues(interview));
  const [validationError, setValidationError] = useState<string | null>(null);
  const isSaving = isCreating || isUpdating;

  const update = <K extends keyof InterviewFormValues>(field: K, value: InterviewFormValues[K]) =>
    setValues((current) => ({ ...current, [field]: value }));

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = interviewSchema.safeParse(values);
    if (!result.success) {
      setValidationError(result.error.issues[0]?.message ?? 'Please check the interview details.');
      return;
    }
    setValidationError(null);
    const payload = {
      type: result.data.type,
      scheduledAt: new Date(result.data.scheduledAt).toISOString(),
      ...(result.data.durationMinutes ? { durationMinutes: Number(result.data.durationMinutes) } : {}),
      ...(result.data.interviewers.trim() ? { interviewers: result.data.interviewers.trim() } : {}),
      ...(result.data.meetingLocation.trim() ? { meetingLocation: result.data.meetingLocation.trim() } : {}),
      ...(result.data.stage.trim() ? { stage: result.data.stage.trim() } : {}),
      ...(result.data.notes.trim() ? { notes: result.data.notes.trim() } : {}),
      ...(result.data.performanceRating ? { performanceRating: Number(result.data.performanceRating) } : {}),
    };
    if (interview) await updateInterview({ interviewId: interview.id, payload });
    else await createInterview(payload);
    onCancel();
  };

  return (
    <form onSubmit={submit} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-800">
          {interview ? 'Edit interview' : 'Schedule interview'}
        </p>
        <button type="button" onClick={onCancel} className="text-slate-400 hover:text-slate-700" aria-label="Close interview form">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1.5 text-xs font-medium text-slate-600">
          Type
          <SearchableSelect value={values.type} options={interviewTypeOptions} onChange={(value) => update('type', value)} searchPlaceholder="Find interview type..." />
        </label>
        <label className="space-y-1.5 text-xs font-medium text-slate-600">
          Date and time
          <Input type="datetime-local" value={values.scheduledAt} onChange={(event) => update('scheduledAt', event.target.value)} disabled={isSaving} />
        </label>
        <label className="space-y-1.5 text-xs font-medium text-slate-600">
          Duration (minutes)
          <Input type="number" min="1" max="1440" value={values.durationMinutes} onChange={(event) => update('durationMinutes', event.target.value)} placeholder="60" disabled={isSaving} />
        </label>
        <label className="space-y-1.5 text-xs font-medium text-slate-600">
          Pipeline stage
          <Input value={values.stage} onChange={(event) => update('stage', event.target.value)} placeholder="Technical interview" disabled={isSaving} />
        </label>
      </div>
      <label className="block space-y-1.5 text-xs font-medium text-slate-600">
        Interviewers <span className="font-normal text-slate-400">(optional)</span>
        <Input value={values.interviewers} onChange={(event) => update('interviewers', event.target.value)} placeholder="Sarah Johnson, John Smith" disabled={isSaving} />
      </label>
      <label className="block space-y-1.5 text-xs font-medium text-slate-600">
        Meeting location <span className="font-normal text-slate-400">(optional)</span>
        <Input value={values.meetingLocation} onChange={(event) => update('meetingLocation', event.target.value)} placeholder="https://meet.google.com/... or Office 4B" disabled={isSaving} />
      </label>
      <label className="block space-y-1.5 text-xs font-medium text-slate-600">
        Notes <span className="font-normal text-slate-400">(optional)</span>
        <RichTextEditor id="interview-notes" value={values.notes} onChange={(value) => update('notes', value)} disabled={isSaving} placeholder="Capture preparation notes, questions, or takeaways." />
      </label>
      {interview && (
        <label className="block space-y-1.5 text-xs font-medium text-slate-600">
          Performance rating <span className="font-normal text-slate-400">(1–5, optional)</span>
          <Input type="number" min="1" max="5" value={values.performanceRating} onChange={(event) => update('performanceRating', event.target.value)} placeholder="4" disabled={isSaving} />
        </label>
      )}
      {validationError && <p className="text-xs text-red-600" role="alert">{validationError}</p>}
      <div className="flex justify-end">
        <Button type="submit" size="sm" disabled={isSaving}>
          {isSaving ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Save className="mr-1.5 h-3.5 w-3.5" />}
          {interview ? 'Save changes' : 'Save interview'}
        </Button>
      </div>
    </form>
  );
}
