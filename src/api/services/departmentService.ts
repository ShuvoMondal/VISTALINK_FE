import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Department } from './types';
import { ApiClient } from './apiClient';

class DepartmentService extends ApiClient {
  // Get all departments
  getAllDepartments = (page: number = 0, size: number = 20) => {
    return this.get<any>('/api/departments', {
      page,
      size
    });
  };

  // Get department by ID
  getDepartmentById = (id: number) => {
    return this.get<Department>(`/api/departments/${id}`);
  };

  // Create department
  createDepartment = (department: Department) => {
    return this.post<Department>('/api/departments', department);
  };

  // Update department
  updateDepartment = (id: number, department: Department) => {
    return this.put<Department>(`/api/departments/${id}`, department);
  };

  // Delete department
  deleteDepartment = (id: number) => {
    return this.delete<{}>(`/api/departments/${id}`);
  };
}

const departmentService = new DepartmentService();

// React Query hooks for department management
export const useGetAllDepartmentsQuery = (page: number = 0, size: number = 20) => {
  return useQuery({
    queryKey: ['departments', page, size],
    queryFn: async () => {
      // Get the paginated response and extract departments properly
      const response = await departmentService.getAllDepartments(page, size);
      // Handle both paginated and plain array responses
      return Array.isArray(response) ? { content: response } : response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetDepartmentByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ['department', id],
    queryFn: () => departmentService.getDepartmentById(id),
    enabled: !!id,
  });
};

export const useCreateDepartmentMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (department: Department) => departmentService.createDepartment(department),
    onSuccess: () => {
      // Invalidate and refetch department queries
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });
};

export const useUpdateDepartmentMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, department }: { id: number; department: Department }) => 
      departmentService.updateDepartment(id, department),
    onSuccess: (_, { id }) => {
      // Invalidate and refetch department queries
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      queryClient.invalidateQueries({ queryKey: ['department', id] });
    },
  });
};

export const useDeleteDepartmentMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => departmentService.deleteDepartment(id),
    onSuccess: () => {
      // Invalidate and refetch department queries
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });
};

export default departmentService;