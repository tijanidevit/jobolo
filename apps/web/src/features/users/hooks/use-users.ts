import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../api/users.api';

export const useProfile = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: usersApi.getProfile,
  });

  const updateProfileMutation = useMutation({
    mutationFn: usersApi.updateProfile,
    onSuccess: (updatedData) => {
      // Optimistically update the profile and the 'me' query
      queryClient.setQueryData(['profile'], updatedData);
      queryClient.invalidateQueries({ queryKey: ['me'] });
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
