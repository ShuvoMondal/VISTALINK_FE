import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Role } from './types';
import { ApiClient } from './apiClient';

class RoleService extends ApiClient {
  // Get all roles
  getAllRoles = () => {
    return this.get<Role[]>('/api/roles');
  };

  // Get role by ID
  getRoleById = (id: number) => {
    return this.get<Role>(`/api/roles/${id}`);
  };

  // Create role
  createRole = (role: Role) => {
    return this.post<Role>('/api/roles', role);
  };

  // Update role
  updateRole = (id: number, role: Role) => {
    return this.put<Role>(`/api/roles/${id}`, role);
  };

  // Delete role
  deleteRole = (id: number) => {
    return this.delete<{}>(`/api/roles/${id}`);
  };
}

const roleService = new RoleService();

// React Query hooks for role management
export const useGetAllRolesQuery = () => {
  return useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const response = await roleService.getAllRoles();
      // Handle both paginated and plain array responses
      return Array.isArray(response) ? { content: response } : response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetRoleByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ['role', id],
    queryFn: () => roleService.getRoleById(id),
    enabled: !!id,
  });
};

export const useCreateRoleMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (role: Role) => roleService.createRole(role),
    onSuccess: () => {
      // Invalidate and refetch role queries
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
};

export const useUpdateRoleMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, role }: { id: number; role: Role }) => 
      roleService.updateRole(id, role),
    onSuccess: (_, { id }) => {
      // Invalidate and refetch role queries
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['role', id] });
    },
  });
};

export const useDeleteRoleMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => roleService.deleteRole(id),
    onSuccess: () => {
      // Invalidate and refetch role queries
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
};

export default roleService;