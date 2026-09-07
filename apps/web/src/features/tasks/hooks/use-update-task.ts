import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '../api/tasks.api';
import { tasksQueryKey } from './use-tasks';
import type { TaskPayload } from '../types';

export function useUpdateTask(opportunityId: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ taskId, payload }: { taskId: string; payload: Partial<TaskPayload> }) =>
      tasksApi.update(opportunityId, taskId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tasksQueryKey(opportunityId) }),
  });
  return { updateTask: mutation.mutateAsync, isUpdating: mutation.isPending };
}
