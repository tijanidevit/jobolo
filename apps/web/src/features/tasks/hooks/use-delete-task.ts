import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '../api/tasks.api';
import { tasksQueryKey } from './use-tasks';

export function useDeleteTask(opportunityId: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (taskId: string) => tasksApi.remove(opportunityId, taskId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tasksQueryKey(opportunityId) }),
  });
  return { deleteTask: mutation.mutateAsync, isDeleting: mutation.isPending };
}
