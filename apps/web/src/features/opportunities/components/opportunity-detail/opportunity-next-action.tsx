'use client';

import { useState, type FormEvent } from 'react';
import { CalendarClock, Check, Loader2, Pencil, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useUpdateOpportunity } from '../../hooks/use-update-opportunity';
import type { Opportunity } from '../../types';

function toDateTimeLocal(value: string | null) {
  if (!value) return '';
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(
    new Date(value),
  );
}

function isOverdue(value: string | null) {
  return value !== null && new Date(value).getTime() < Date.now();
}

export function OpportunityNextAction({ opportunity }: { opportunity: Opportunity }) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3 pb-4">
        <div>
          <CardTitle className="text-base">Next action</CardTitle>
          <p className="mt-1 text-sm text-slate-500">
            The clearest thing to do next for this opportunity.
          </p>
        </div>
        {!isEditing && (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Pencil className="mr-1.5 h-3.5 w-3.5" />
            {opportunity.nextAction ? 'Edit' : 'Add action'}
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        {isEditing ? (
          <NextActionForm opportunity={opportunity} onCancel={() => setIsEditing(false)} />
        ) : (
          <NextActionSummary opportunity={opportunity} />
        )}
      </CardContent>
    </Card>
  );
}

function NextActionSummary({ opportunity }: { opportunity: Opportunity }) {
  if (!opportunity.nextAction) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 px-4 py-5 text-center">
        <p className="text-sm font-medium text-slate-700">No next action set</p>
        <p className="mt-1 text-xs text-slate-500">
          Choose one concrete step to keep this opportunity moving.
        </p>
      </div>
    );
  }
  const overdue = isOverdue(opportunity.nextActionDueDate);
  return (
    <div className="flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50/60 px-4 py-4">
      <div className="mt-0.5 rounded-full bg-blue-600 p-1 text-white">
        <Check className="h-3.5 w-3.5" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-900">{opportunity.nextAction}</p>
        {opportunity.nextActionDueDate && (
          <p
            className={`mt-1 flex items-center gap-1.5 text-xs ${overdue ? 'font-medium text-red-600' : 'text-slate-500'}`}
          >
            <CalendarClock className="h-3.5 w-3.5" />
            {overdue ? 'Overdue · ' : ''}
            {formatDate(opportunity.nextActionDueDate)}
          </p>
        )}
      </div>
    </div>
  );
}

function NextActionForm({
  opportunity,
  onCancel,
}: {
  opportunity: Opportunity;
  onCancel: () => void;
}) {
  const { updateOpportunity, isUpdating } = useUpdateOpportunity(opportunity.id);
  const [action, setAction] = useState(opportunity.nextAction ?? '');
  const [dueDate, setDueDate] = useState(toDateTimeLocal(opportunity.nextActionDueDate));
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (action.trim().length > 500) {
      setError('Next action must be 500 characters or fewer.');
      return;
    }
    setError(null);
    await updateOpportunity({
      nextAction: action.trim(),
      nextActionDueDate: dueDate ? new Date(dueDate).toISOString() : null,
    });
    onCancel();
  };

  const clear = async () => {
    await updateOpportunity({ nextAction: '', nextActionDueDate: null });
    onCancel();
  };

  return (
    <form
      onSubmit={submit}
      className="space-y-3 rounded-lg border border-slate-200 bg-slate-50/70 p-4"
    >
      <label className="block space-y-1.5 text-xs font-medium text-slate-600">
        Next action
        <Input
          value={action}
          onChange={(event) => setAction(event.target.value)}
          placeholder="Follow up with recruiter"
          disabled={isUpdating}
        />
      </label>
      <label className="block space-y-1.5 text-xs font-medium text-slate-600">
        Due date
        <input
          type="datetime-local"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
          className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
          disabled={isUpdating}
        />
      </label>
      {error && (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" size="sm" onClick={onCancel} disabled={isUpdating}>
          <X className="mr-1.5 h-3.5 w-3.5" />
          Cancel
        </Button>
        {opportunity.nextAction && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => void clear()}
            disabled={isUpdating}
          >
            Clear
          </Button>
        )}
        <Button type="submit" size="sm" disabled={isUpdating}>
          {isUpdating && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}Save action
        </Button>
      </div>
    </form>
  );
}
