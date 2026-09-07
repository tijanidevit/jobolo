import { useMutation, useQueryClient } from '@tanstack/react-query';
import { contactsApi } from '../api/contacts.api';
import { contactsQueryKey } from './use-contacts';
import type { ContactPayload } from '../types';

export function useUpdateContact(opportunityId: string, contactId: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (payload: Partial<ContactPayload>) =>
      contactsApi.update(opportunityId, contactId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: contactsQueryKey(opportunityId) }),
  });

  return { updateContact: mutation.mutateAsync, isUpdating: mutation.isPending };
}
