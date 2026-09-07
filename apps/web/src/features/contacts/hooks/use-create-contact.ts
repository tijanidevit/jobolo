import { useMutation, useQueryClient } from '@tanstack/react-query';
import { contactsApi } from '../api/contacts.api';
import { contactsQueryKey } from './use-contacts';
import type { ContactPayload } from '../types';

export function useCreateContact(opportunityId: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (payload: ContactPayload) => contactsApi.create(opportunityId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: contactsQueryKey(opportunityId) }),
  });

  return { createContact: mutation.mutateAsync, isCreating: mutation.isPending };
}
