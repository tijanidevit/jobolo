'use client';

import { useState, type FormEvent } from 'react';
import { Loader2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { useCreateTask } from '../hooks/use-create-task';
import { useUpdateTask } from '../hooks/use-update-task';
import { taskSchema, type TaskFormValues } from '../schemas/task.schema';
import { TASK_PRIORITIES, type Task } from '../types';

const priorityOptions = TASK_PRIORITIES.map((priority) => ({
  value: priority,
  label: priority[0].toUpperCase() + priority.slice(1),
}));

function toDateTimeLocal(value?: string | null) {
  if (!value) return '';
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function initialValues(task?: Task): TaskFormValues {
  return {
    title: task?.title ?? '',
    description: task?.description ?? '',
    dueDate: toDateTimeLocal(task?.dueDate),
    priority: task?.priority ?? 'medium',
    reminderAt: toDateTimeLocal(task?.reminderAt),
  };
}

export function TaskForm({
  opportunityId,
  task,
  onCancel,
}: {
  opportunityId: string;
  task?: Task;
  onCancel: () => void;
}) {
  const { createTask, isCreating } = useCreateTask(opportunityId);
  const { updateTask, isUpdating } = useUpdateTask(opportunityId);
  const [values, setValues] = useState(() => initialValues(task));
  const [validationError, setValidationError] = useState<string | null>(null);
  const isSaving = isCreating || isUpdating;

  const update = <K extends keyof TaskFormValues>(field: K, value: TaskFormValues[K]) =>
    setValues((current) => ({ ...current, [field]: value }));

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = taskSchema.safeParse(values);
    if (!result.success) {
      setValidationError(result.error.issues[0]?.message ?? 'Please check the task details.');
      return;
    }
    setValidationError(null);
    const payload = {
      title: result.data.title,
      priority: result.data.priority,
      ...(result.data.description.trim() ? { description: result.data.description.trim() } : {}),
      ...(result.data.dueDate ? { dueDate: new Date(result.data.dueDate).toISOString() } : {}),
      ...(result.data.reminderAt
        ? { reminderAt: new Date(result.data.reminderAt).toISOString() }
        : {}),
    };
    if (task) await updateTask({ taskId: task.id, payload });
    else await createTask(payload);
    onCancel();
  };

  return (
    <form onSubmit={submit} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-800">{task ? 'Edit task' : 'New task'}</p>
        <button
          type="button"
          onClick={onCancel}
          className="text-slate-400 hover:text-slate-700"
          aria-label="Close task form"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <label className="block space-y-1.5 text-xs font-medium text-slate-600">
        Title
        <Input
          value={values.title}
          onChange={(event) => update('title', event.target.value)}
          placeholder="Follow up with recruiter"
          disabled={isSaving}
        />
      </label>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="space-y-1.5 text-xs font-medium text-slate-600">
          Due date
          <input
            type="datetime-local"
            value={values.dueDate}
            onChange={(event) => update('dueDate', event.target.value)}
            className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
            disabled={isSaving}
          />
        </label>
        <label className="space-y-1.5 text-xs font-medium text-slate-600">
          Priority
          <SearchableSelect
            value={values.priority}
            options={priorityOptions}
            onChange={(value) => update('priority', value as TaskFormValues['priority'])}
          />
        </label>
        <label className="space-y-1.5 text-xs font-medium text-slate-600">
          Reminder
          <input
            type="datetime-local"
            value={values.reminderAt}
            onChange={(event) => update('reminderAt', event.target.value)}
            className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
            disabled={isSaving}
          />
        </label>
      </div>
      <label className="block space-y-1.5 text-xs font-medium text-slate-600">
        Description <span className="font-normal text-slate-400">(optional)</span>
        <RichTextEditor
          id="task-description"
          value={values.description}
          onChange={(value) => update('description', value)}
          disabled={isSaving}
          placeholder="Add context or steps for completing this task."
        />
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
          {task ? 'Save changes' : 'Save task'}
        </Button>
      </div>
    </form>
  );
}
