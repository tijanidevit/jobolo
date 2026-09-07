import { useMutation, useQueryClient } from '@tanstack/react-query';
import { contactsApi } from '../api/contacts.api';
import { contactsQueryKey } from './use-contacts';

export function useDeleteContact(opportunityId: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (contactId: string) => contactsApi.remove(opportunityId, contactId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: contactsQueryKey(opportunityId) }),
  });

  return { deleteContact: mutation.mutateAsync, isDeleting: mutation.isPending };
}
