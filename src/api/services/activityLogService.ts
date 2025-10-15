import { useQuery } from '@tanstack/react-query';
import { PageUserActivityLog } from './types';
import { ApiClient } from './apiClient';

class ActivityLogService extends ApiClient {
  // Get all activity logs
  getAllLogs = () => {
    return this.get<PageUserActivityLog>('/api/activity-logs');
  };

  // Search logs by username
  searchByUsername = (username: string, page: number = 0, size: number = 10) => {
    return this.get<PageUserActivityLog>('/api/activity-logs/search', {
      username,
      page,
      size
    });
  };

  // Get current user's logs
  getLogs = (page: number = 0, size: number = 10) => {
    return this.get<PageUserActivityLog>('/api/activity-logs/me', {
      page,
      size
    });
  };
}

const activityLogService = new ActivityLogService();

// React Query hooks for activity logs
export const useGetAllLogsQuery = () => {
  return useQuery({
    queryKey: ['activityLogs'],
    queryFn: async () => {
      const response = await activityLogService.getAllLogs();
      // Handle both paginated and plain array responses
      return response?.content || response || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSearchByUsernameQuery = (username: string, page: number = 0, size: number = 10, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['activityLogsSearch', username, page, size],
    queryFn: async () => {
      const response = await activityLogService.searchByUsername(username, page, size);
      // Handle both paginated and plain array responses
      return response?.content || response || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled,
  });
};

export const useGetLogsQuery = (page: number = 0, size: number = 10) => {
  return useQuery({
    queryKey: ['userActivityLogs', page, size],
    queryFn: async () => {
      const response = await activityLogService.getLogs(page, size);
      // Handle both paginated and plain array responses
      return response?.content || response || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export default activityLogService;