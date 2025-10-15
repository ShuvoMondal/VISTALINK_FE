import { useQuery } from '@tanstack/react-query';
import { Permission, PermissionResponse } from './types';
import { ApiClient } from './apiClient';

class PermissionService extends ApiClient {
  // Get all permissions
  getAllPermissions = () => {
    return this.get<Permission[]>('/api/permissions');
  };

  // Get permissions for current user
  getAllPermissionsByUser = () => {
    return this.get<Record<string, PermissionResponse[]>>('/api/permissions/me');
  };

  // Get all permissions by group
  getAllPermissionsByGroup = () => {
    return this.get<Record<string, PermissionResponse[]>>('/api/permissions/byGroup');
  };
}

const permissionService = new PermissionService();

// React Query hooks for permissions
export const useGetAllPermissionsQuery = () => {
  return useQuery({
    queryKey: ['permissions'],
    queryFn: () => permissionService.getAllPermissions(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetPermissionsByUserQuery = () => {
  return useQuery({
    queryKey: ['permissionsByUser'],
    queryFn: () => permissionService.getAllPermissionsByUser(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetPermissionsByGroupQuery = () => {
  return useQuery({
    queryKey: ['permissionsByGroup'],
    queryFn: () => permissionService.getAllPermissionsByGroup(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export default permissionService;