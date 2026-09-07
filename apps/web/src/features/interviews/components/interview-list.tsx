'use client';

import { useState } from 'react';
import { CalendarDays, Clock3, ExternalLink, MapPin, Pencil, Plus, Star, Trash2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { RichText } from '@/components/ui/rich-text';
import { useDeleteInterview } from '../hooks/use-delete-interview';
import { useInterviews } from '../hooks/use-interviews';
import type { Interview } from '../types';
import { InterviewForm } from './interview-form';

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

function isHttpUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

export function InterviewList({ opportunityId }: { opportunityId: string }) {
  const [editingInterview, setEditingInterview] = useState<Interview | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const { interviews, isLoading, error, refetch } = useInterviews(opportunityId);
  const { deleteInterview, isDeleting } = useDeleteInterview(opportunityId);
  const visibleInterviews = interviews.filter((interview) => interview.id !== editingInterview?.id);

  const remove = async (interview: Interview) => {
    if (!window.confirm(`Delete this ${interview.type.toLowerCase()} interview?`)) return;
    await deleteInterview(interview.id).catch(() => undefined);
  };

  const closeForm = () => {
    setIsAdding(false);
    setEditingInterview(null);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <div>
          <CardTitle className="text-base">Interviews</CardTitle>
          <p className="mt-1 text-sm text-slate-500">Plan conversations and capture what you learn.</p>
        </div>
        {!isAdding && !editingInterview && (
          <Button variant="outline" size="sm" onClick={() => setIsAdding(true)}>
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Schedule interview
          </Button>
        )}
      </CardHeader>
      {(isAdding || editingInterview) && (
        <CardContent className="border-t border-slate-100 pt-5">
          <InterviewForm key={editingInterview?.id ?? 'new'} opportunityId={opportunityId} interview={editingInterview ?? undefined} onCancel={closeForm} />
        </CardContent>
      )}
      <CardContent className={isAdding || editingInterview ? 'pt-5' : 'pt-0'}>
        {isLoading && <LoadingState message="Loading interviews..." className="py-6" />}
        {error && <ErrorState message="We could not load interviews." onRetry={() => void refetch()} className="mt-2" />}
        {!isLoading && !error && visibleInterviews.length === 0 && !isAdding && !editingInterview && (
          <div className="rounded-lg border border-dashed border-slate-200 px-4 py-7 text-center">
            <p className="text-sm font-medium text-slate-700">No interviews scheduled</p>
            <p className="mt-1 text-xs text-slate-500">Keep your upcoming conversations and learnings here.</p>
          </div>
        )}
        {!isLoading && !error && visibleInterviews.length > 0 && (
          <div className="space-y-3">
            {visibleInterviews.map((interview) => (
              <InterviewCard key={interview.id} interview={interview} isDeleting={isDeleting} onEdit={() => setEditingInterview(interview)} onDelete={() => void remove(interview)} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function InterviewCard({ interview, isDeleting, onEdit, onDelete }: { interview: Interview; isDeleting: boolean; onEdit: () => void; onDelete: () => void }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-slate-50/70 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{interview.type} interview</p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500"><CalendarDays className="h-3.5 w-3.5" />{formatDate(interview.scheduledAt)}</p>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={onEdit} aria-label="Edit interview"><Pencil className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="icon" onClick={onDelete} disabled={isDeleting} aria-label="Delete interview"><Trash2 className="h-3.5 w-3.5 text-red-500" /></Button>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-600">
        {interview.durationMinutes && <span className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" />{interview.durationMinutes} min</span>}
        {interview.interviewers && <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{interview.interviewers}</span>}
        {interview.stage && <span className="rounded-full bg-blue-50 px-2 py-1 font-medium text-blue-700">{interview.stage}</span>}
        {interview.performanceRating && <span className="flex items-center gap-1 text-amber-600"><Star className="h-3.5 w-3.5 fill-current" />{interview.performanceRating}/5</span>}
        {interview.meetingLocation && (
          isHttpUrl(interview.meetingLocation) ? (
            <a className="flex items-center gap-1.5 text-blue-600 hover:underline" href={interview.meetingLocation} target="_blank" rel="noreferrer">
              <ExternalLink className="h-3.5 w-3.5" />
              Meeting link
            </a>
          ) : (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {interview.meetingLocation}
            </span>
          )
        )}
      </div>
      {interview.notes && <div className="mt-3 border-t border-slate-200 pt-3"><RichText text={interview.notes} /></div>}
    </article>
  );
}
