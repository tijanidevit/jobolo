'use client';

import { useState } from 'react';
import { CalendarClock, Check, Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { RichText } from '@/components/ui/rich-text';
import { useDeleteTask } from '../hooks/use-delete-task';
import { useTasks } from '../hooks/use-tasks';
import { useUpdateTask } from '../hooks/use-update-task';
import type { Task } from '../types';
import { TaskForm } from './task-form';

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

function isOverdue(task: Task) {
  return task.status === 'pending' && task.dueDate !== null && new Date(task.dueDate).getTime() < Date.now();
}

export function TaskList({ opportunityId }: { opportunityId: string }) {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const { tasks, isLoading, error, refetch } = useTasks(opportunityId);
  const { deleteTask, isDeleting } = useDeleteTask(opportunityId);
  const { updateTask, isUpdating } = useUpdateTask(opportunityId);
  const visibleTasks = tasks.filter((task) => task.id !== editingTask?.id);

  const closeForm = () => {
    setIsAdding(false);
    setEditingTask(null);
  };
  const remove = async (task: Task) => {
    if (!window.confirm(`Delete task "${task.title}"?`)) return;
    await deleteTask(task.id).catch(() => undefined);
  };
  const toggle = async (task: Task) => {
    await updateTask({ taskId: task.id, payload: { status: task.status === 'completed' ? 'pending' : 'completed' } });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <div><CardTitle className="text-base">Tasks</CardTitle><p className="mt-1 text-sm text-slate-500">Turn each opportunity into a clear next step.</p></div>
        {!isAdding && !editingTask && <Button variant="outline" size="sm" onClick={() => setIsAdding(true)}><Plus className="mr-1.5 h-3.5 w-3.5" />Add task</Button>}
      </CardHeader>
      {(isAdding || editingTask) && <CardContent className="border-t border-slate-100 pt-5"><TaskForm key={editingTask?.id ?? 'new'} opportunityId={opportunityId} task={editingTask ?? undefined} onCancel={closeForm} /></CardContent>}
      <CardContent className={isAdding || editingTask ? 'pt-5' : 'pt-0'}>
        {isLoading && <LoadingState message="Loading tasks..." className="py-6" />}
        {error && <ErrorState message="We could not load tasks." onRetry={() => void refetch()} className="mt-2" />}
        {!isLoading && !error && visibleTasks.length === 0 && !isAdding && !editingTask && <div className="rounded-lg border border-dashed border-slate-200 px-4 py-7 text-center"><p className="text-sm font-medium text-slate-700">No tasks yet</p><p className="mt-1 text-xs text-slate-500">Add the next action for this opportunity.</p></div>}
        {!isLoading && !error && visibleTasks.length > 0 && <div className="space-y-3">{visibleTasks.map((task) => <TaskCard key={task.id} task={task} isDeleting={isDeleting} isUpdating={isUpdating} onToggle={() => void toggle(task)} onEdit={() => setEditingTask(task)} onDelete={() => void remove(task)} />)}</div>}
      </CardContent>
    </Card>
  );
}

function TaskCard({ task, isDeleting, isUpdating, onToggle, onEdit, onDelete }: { task: Task; isDeleting: boolean; isUpdating: boolean; onToggle: () => void; onEdit: () => void; onDelete: () => void }) {
  const overdue = isOverdue(task);
  return (
    <article className={`rounded-lg border p-4 ${task.status === 'completed' ? 'border-slate-200 bg-slate-50 opacity-70' : overdue ? 'border-red-200 bg-red-50/40' : 'border-slate-200 bg-slate-50/70'}`}>
      <div className="flex items-start gap-3">
        <button type="button" onClick={onToggle} disabled={isUpdating} aria-label={task.status === 'completed' ? `Reopen ${task.title}` : `Complete ${task.title}`} className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${task.status === 'completed' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white'}`}><Check className="h-3.5 w-3.5" /></button>
        <div className="min-w-0 flex-1"><p className={`text-sm font-semibold ${task.status === 'completed' ? 'text-slate-500 line-through' : 'text-slate-900'}`}>{task.title}</p><div className="mt-2 flex flex-wrap items-center gap-2 text-xs"><span className={`rounded-full px-2 py-1 font-medium ${task.priority === 'high' ? 'bg-red-100 text-red-700' : task.priority === 'low' ? 'bg-slate-100 text-slate-600' : 'bg-amber-100 text-amber-700'}`}>{task.priority}</span>{task.dueDate && <span className={overdue ? 'font-medium text-red-600' : 'text-slate-500'}><CalendarClock className="mr-1 inline h-3.5 w-3.5" />{overdue ? 'Overdue · ' : ''}{formatDate(task.dueDate)}</span>}</div>{task.description && <div className="mt-3 border-t border-slate-200 pt-3"><RichText text={task.description} /></div>}</div>
        <div className="flex items-center gap-1"><Button variant="ghost" size="icon" onClick={onEdit} aria-label={`Edit ${task.title}`}><Pencil className="h-3.5 w-3.5" /></Button><Button variant="ghost" size="icon" onClick={onDelete} disabled={isDeleting} aria-label={`Delete ${task.title}`}><Trash2 className="h-3.5 w-3.5 text-red-500" /></Button></div>
      </div>
    </article>
  );
}
