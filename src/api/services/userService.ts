import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { User, UpdatePasswordDto } from './types';
import { ApiClient } from './apiClient';

class UserService extends ApiClient {
  // Get all users
  getAllUsers = (page: number = 0, size: number = 20) => {
    return this.get<any>('/api/users', {
      page,
      size
    });
  };

  // Get user by ID
  getUserById = (id: number) => {
    return this.get<User>(`/api/users/${id}`);
  };

  // Create user
  createUser = (user: User) => {
    return this.post<User>('/api/users', user);
  };

  // Update user
  updateUser = (id: number, user: User) => {
    return this.put<User>(`/api/users/${id}`, user);
  };

  // Delete user
  deleteUser = (id: number) => {
    return this.delete<{}>(`/api/users/${id}`);
  };

  // Update current user password
  updateCurrentUserPassword = (passwordData: UpdatePasswordDto) => {
    return this.put<{}>('/api/users/me', passwordData);
  };

}

const userService = new UserService();

// React Query hooks for user management
export const useGetAllUsersQuery = (page: number = 0, size: number = 20) => {
  return useQuery({
    queryKey: ['users', page, size],
    queryFn: async () => {
      // Get the paginated response and extract users properly
      const response = await userService.getAllUsers(page, size);
      // Handle both paginated and plain array responses
      return Array.isArray(response) ? { content: response } : response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetUserByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.getUserById(id),
    enabled: !!id,
  });
};

export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (user: User) => userService.createUser(user),
    onSuccess: () => {
      // Invalidate and refetch user queries
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, user }: { id: number; user: User }) => 
      userService.updateUser(id, user),
    onSuccess: (_, { id }) => {
      // Invalidate and refetch user queries
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', id] });
    },
  });
};

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => userService.deleteUser(id),
    onSuccess: () => {
      // Invalidate and refetch user queries
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUpdateCurrentUserPasswordMutation = () => {
  return useMutation({
    mutationFn: (passwordData: UpdatePasswordDto) => 
      userService.updateCurrentUserPassword(passwordData),
  });
};



export default userService;