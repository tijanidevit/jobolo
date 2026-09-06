import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../api/users.api';
import { useAuthStore } from '@/features/auth/store/auth.store';

export const useProfile = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  const { data, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: usersApi.getProfile,
  });

  const updateProfileMutation = useMutation({
    mutationFn: usersApi.updateProfile,
    onSuccess: (updatedData) => {
      queryClient.setQueryData(['profile'], updatedData);
      const profile = updatedData.data;
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        setUser({
          ...currentUser,
          firstName: profile.firstName,
          lastName: profile.lastName,
        });
      }
    },
  });

  return {
    profile: data?.data,
    isLoading,
    error,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdating: updateProfileMutation.isPending,
    updateError: updateProfileMutation.error,
  };
};
