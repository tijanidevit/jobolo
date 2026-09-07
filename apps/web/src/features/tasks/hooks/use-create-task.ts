import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '../api/tasks.api';
import { tasksQueryKey } from './use-tasks';
import type { TaskPayload } from '../types';

export function useCreateTask(opportunityId: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (payload: TaskPayload) => tasksApi.create(opportunityId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tasksQueryKey(opportunityId) }),
  });
  return { createTask: mutation.mutateAsync, isCreating: mutation.isPending };
}
