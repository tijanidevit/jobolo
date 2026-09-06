'use client';

import { useState } from 'react';
import { Activity, CalendarPlus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/ui/loading-state';
import { useOpportunityTimeline } from '../../hooks/use-opportunity-timeline';
import { useCreateOpportunityActivity } from '../../hooks/use-create-opportunity-activity';
import { useUpdateOpportunityActivity } from '../../hooks/use-update-opportunity-activity';
import type { OpportunityActivity } from '../../types';
import { activityErrorMessage, type ActivityFormValues } from '../../utils/activity.utils';
import { OpportunityActivityForm } from './opportunity-activity-form';
import { OpportunityTimelineItem } from './opportunity-timeline-item';

export function OpportunityTimeline({ opportunityId }: { opportunityId: string }) {
  const [formActivity, setFormActivity] = useState<OpportunityActivity | null | undefined>(
    undefined,
  );
  const { activities, isLoading, error } = useOpportunityTimeline(opportunityId);
  const { createActivity, isCreating } = useCreateOpportunityActivity(opportunityId);
  const { updateActivity, isUpdating } = useUpdateOpportunityActivity(opportunityId);
  const closeForm = () => {
    setFormActivity(undefined);
  };
  const openCreateForm = () => {
    setFormActivity(null);
  };
  const saveActivity = async (values: ActivityFormValues, files: File[]) => {
    const payload = {
      ...values,
      type: values.type as OpportunityActivity['type'],
      occurredAt: new Date(values.occurredAt).toISOString(),
    };
    if (formActivity) await updateActivity({ activityId: formActivity.id, payload });
    else await createActivity({ payload, files });
    closeForm();
  };
  return (
    <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-5">
      <TimelineHeader onAdd={openCreateForm} />
      {formActivity !== undefined && (
        <OpportunityActivityForm
          key={formActivity?.id ?? 'new'}
          activity={formActivity ?? undefined}
          isSaving={isCreating || isUpdating}
          onSubmit={saveActivity}
          onCancel={closeForm}
        />
      )}
      <TimelineContent
        activities={activities}
        isLoading={isLoading}
        error={error}
        onEdit={(activity) => {
          setFormActivity(activity);
        }}
      />
    </div>
  );
}

function TimelineHeader({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4 text-blue-600" aria-hidden="true" />
        <h3 className="text-sm font-semibold text-slate-900">Timeline</h3>
      </div>
      <Button variant="outline" size="sm" onClick={onAdd}>
        <Plus className="mr-1.5 h-3.5 w-3.5" />
        Add activity
      </Button>
    </div>
  );
}

function TimelineContent({
  activities,
  isLoading,
  error,
  onEdit,
}: {
  activities: OpportunityActivity[];
  isLoading: boolean;
  error: unknown;
  onEdit: (activity: OpportunityActivity) => void;
}) {
  if (isLoading) return <LoadingState message="Loading timeline..." className="py-3" />;
  if (error)
    return (
      <p className="py-3 text-sm text-red-600" role="alert">
        {activityErrorMessage(error)}
      </p>
    );
  if (activities.length === 0)
    return (
      <div className="rounded-lg border border-dashed border-slate-200 bg-white px-4 py-5 text-center">
        <CalendarPlus className="mx-auto h-5 w-5 text-slate-400" />
        <p className="mt-2 text-sm font-medium text-slate-700">No activities recorded yet</p>
        <p className="mt-1 text-xs text-slate-500">
          Add the first event to start remembering this opportunity.
        </p>
      </div>
    );
  return (
    <ol className="space-y-4">
      {activities.map((activity) => (
        <OpportunityTimelineItem
          key={activity.id}
          activity={activity}
          onEdit={() => onEdit(activity)}
        />
      ))}
    </ol>
  );
}
