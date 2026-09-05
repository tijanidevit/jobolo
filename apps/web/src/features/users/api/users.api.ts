import { api } from '@/lib/axios';
import { UserProfileResponse, UpdateProfilePayload } from '../types';

export const usersApi = {
  getProfile: async () => {
    const response = await api.get<UserProfileResponse>('/profile');
    return response.data;
  },
  
  updateProfile: async (data: UpdateProfilePayload) => {
    const response = await api.patch<UserProfileResponse>('/profile', data);
    return response.data;
  },
};
