import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Notification } from './types';
import { ApiClient } from './apiClient';

class NotificationService extends ApiClient {
  // Get notifications by username
  getNotifications = (username: string) => {
    return this.get<Notification[]>(`/api/notifications/${username}`);
  };

  // Create notification
  createNotification = (notification: Notification) => {
    return this.post<Notification>('/api/notifications', notification);
  };

  // Mark notification as read
  markAsRead = (id: number) => {
    return this.put<{}>(`/api/notifications/${id}/read`);
  };

  // Delete notification
  deleteNotification = (id: number) => {
    return this.delete<{}>(`/api/notifications/${id}`);
  };
}

const notificationService = new NotificationService();

// React Query hooks for notifications
export const useGetNotificationsQuery = (username: string) => {
  return useQuery({
    queryKey: ['notifications', username],
    queryFn: async () => {
      const response = await notificationService.getNotifications(username);
      // Handle both paginated and plain array responses
      return response?.content || response || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateNotificationMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (notification: Notification) => 
      notificationService.createNotification(notification),
    onSuccess: (_, notification) => {
      // Invalidate and refetch notification queries for the recipient
      queryClient.invalidateQueries({ queryKey: ['notifications', notification.recipientUsername] });
    },
  });
};

export const useMarkAsReadMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => notificationService.markAsRead(id),
    onSuccess: (_, id) => {
      // Invalidate and refetch all notification queries
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useDeleteNotificationMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => notificationService.deleteNotification(id),
    onSuccess: (_, id) => {
      // Invalidate and refetch all notification queries
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export default notificationService;