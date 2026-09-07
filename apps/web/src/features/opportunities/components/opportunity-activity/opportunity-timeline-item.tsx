'use client';

import { Clock3, Pencil } from 'lucide-react';
import { AttachmentDownloadButton } from '@/components/ui/attachment';
import { RichText } from '@/components/ui/rich-text';
import { cn } from '@/lib/utils';
import { activitiesApi } from '../../api/activities.api';
import type { OpportunityActivity } from '../../types';
import { activityLabel } from '../../utils/activity.utils';

export function OpportunityTimelineItem({
  activity,
  onEdit,
}: {
  activity: OpportunityActivity;
  onEdit: () => void;
}) {
  return (
    <li className="relative pl-6 before:absolute before:bottom-[-1rem] before:left-[5px] before:top-2 before:w-px before:bg-slate-200 last:before:hidden">
      <span
        className="absolute left-0 top-1.5 h-3 w-3 rounded-full border-2 border-white bg-blue-500 shadow-sm"
        aria-hidden="true"
      />
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <div className="flex items-start gap-2">
            <div>
              <p className="text-sm font-medium text-slate-800">{activity.title}</p>
              <p className="text-xs font-medium text-blue-600">{activityLabel(activity.type)}</p>
            </div>
            <button
              type="button"
              onClick={onEdit}
              className="rounded p-1 text-slate-400 hover:bg-white hover:text-blue-600"
              aria-label={`Edit ${activity.title}`}
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          </div>
          {activity.description && (
            <div className="mt-2">
              <RichText text={activity.description} />
            </div>
          )}
          {activity.attachments?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {activity.attachments.map((attachment) => (
                <AttachmentDownloadButton
                  key={attachment.id}
                  fileName={attachment.originalName}
                  onDownload={() =>
                    activitiesApi.downloadAttachment(
                      activity.opportunityId,
                      activity.id,
                      attachment.storedName,
                    )
                  }
                />
              ))}
            </div>
          )}
        </div>
        <time
          dateTime={activity.occurredAt}
          className={cn('flex shrink-0 items-center gap-1 text-xs text-slate-400', 'sm:pt-0.5')}
        >
          <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
          {new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(
            new Date(activity.occurredAt),
          )}
        </time>
      </div>
    </li>
  );
}
