import type { ApiResponse } from '@jobolo/shared';
import { api } from '@/lib/axios';
import type { Contact, ContactPayload } from '../types';

export const contactsApi = {
  list: async (opportunityId: string) => {
    const response = await api.get<ApiResponse<Contact[]>>(
      `/opportunities/${opportunityId}/contacts`,
    );
    return response.data;
  },

  create: async (opportunityId: string, payload: ContactPayload) => {
    const response = await api.post<ApiResponse<Contact>>(
      `/opportunities/${opportunityId}/contacts`,
      payload,
    );
    return response.data;
  },

  update: async (opportunityId: string, contactId: string, payload: Partial<ContactPayload>) => {
    const response = await api.patch<ApiResponse<Contact>>(
      `/opportunities/${opportunityId}/contacts/${contactId}`,
      payload,
    );
    return response.data;
  },

  remove: async (opportunityId: string, contactId: string) => {
    const response = await api.delete<ApiResponse<null>>(
      `/opportunities/${opportunityId}/contacts/${contactId}`,
    );
    return response.data;
  },
};
