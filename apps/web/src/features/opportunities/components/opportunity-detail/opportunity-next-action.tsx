'use client';

import { useState } from 'react';
import { CalendarClock, Check, Loader2, Pencil, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { useTasks } from '@/features/tasks/hooks/use-tasks';
import { useUpdateOpportunity } from '../../hooks/use-update-opportunity';
import type { Opportunity } from '../../types';

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
  const { tasks } = useTasks(opportunity.id);

  return (
    <Card className="border-blue-100 bg-blue-50/40">
      <CardHeader className="flex flex-row items-center justify-between gap-3 pb-3">
        <div>
          <CardTitle className="text-base">Next action</CardTitle>
          <p className="mt-1 text-sm text-slate-500">
            Select one pending task to keep this opportunity moving.
          </p>
        </div>
        {!isEditing && (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Pencil className="mr-1.5 h-3.5 w-3.5" />
            {opportunity.nextActionTaskId ? 'Change task' : 'Select task'}
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        {isEditing ? (
          <NextActionForm
            opportunity={opportunity}
            tasks={tasks}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <NextActionSummary opportunity={opportunity} />
        )}
      </CardContent>
    </Card>
  );
}

function NextActionSummary({ opportunity }: { opportunity: Opportunity }) {
  if (!opportunity.nextActionTaskId || !opportunity.nextAction) {
    return (
      <div className="rounded-lg border border-dashed border-blue-200 bg-white/70 px-4 py-4 text-center">
        <p className="text-sm font-medium text-slate-700">No task selected</p>
        <p className="mt-1 text-xs text-slate-500">
          Create a task first, then select it as the next action.
        </p>
      </div>
    );
  }

  const overdue = isOverdue(opportunity.nextActionDueDate);
  return (
    <div className="flex items-start gap-3 rounded-lg border border-blue-100 bg-white px-4 py-3">
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
  tasks,
  onCancel,
}: {
  opportunity: Opportunity;
  tasks: { id: string; title: string; dueDate: string | null; status: string }[];
  onCancel: () => void;
}) {
  const { updateOpportunity, isUpdating } = useUpdateOpportunity(opportunity.id);
  const [taskId, setTaskId] = useState(opportunity.nextActionTaskId ?? '');
  const taskOptions = tasks
    .filter((task) => task.status !== 'completed')
    .map((task) => ({
      value: task.id,
      label: task.dueDate ? `${task.title} · due ${formatDate(task.dueDate)}` : task.title,
    }));

  const save = async () => {
    await updateOpportunity({ nextActionTaskId: taskId || null });
    onCancel();
  };

  return (
    <div className="space-y-3 rounded-lg border border-blue-100 bg-white p-3">
      <SearchableSelect
        value={taskId}
        options={[{ value: '', label: 'No next action' }, ...taskOptions]}
        onChange={setTaskId}
        placeholder="Select a pending task"
        searchPlaceholder="Search tasks..."
      />
      {taskOptions.length === 0 && (
        <p className="text-xs text-slate-500">
          No pending tasks are available. Add one in the Tasks tab.
        </p>
      )}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" size="sm" onClick={onCancel} disabled={isUpdating}>
          <X className="mr-1.5 h-3.5 w-3.5" />
          Cancel
        </Button>
        <Button type="button" size="sm" onClick={() => void save()} disabled={isUpdating}>
          {isUpdating && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
          Save next action
        </Button>
      </div>
    </div>
  );
}
