import { useQuery } from '@tanstack/react-query';
import { contactsApi } from '../api/contacts.api';

export function contactsQueryKey(opportunityId: string) {
  return ['opportunities', opportunityId, 'contacts'] as const;
}

export function useContacts(opportunityId: string, enabled = true) {
  const query = useQuery({
    queryKey: contactsQueryKey(opportunityId),
    queryFn: () => contactsApi.list(opportunityId),
    enabled,
  });

  return {
    contacts: query.data?.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
