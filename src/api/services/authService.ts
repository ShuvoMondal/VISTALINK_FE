import { useMutation, useQuery } from '@tanstack/react-query';
import { LoginRequest, User } from './types';
import { AuthApiClient, ApiClient } from './apiClient';

class AuthService extends AuthApiClient {
  login = (credentials: LoginRequest) => {
    return this.post('/api/auth/login', credentials);
  };
  
  // Clear the authentication token
  clearToken = () => {
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem('token');
    }
  };
}

class UserService extends ApiClient {
  getCurrentUser = () => {
    return this.request<User>('/api/users/me', {
      method: 'GET',
    });
  };
}

const authService = new AuthService();
const userService = new UserService();

// React Query hooks for authentication
export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (data) => {
      // Store the token in sessionStorage only in browser environment
      if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
        // The API response format is not explicitly defined in the OpenAPI spec,
        // so we'll handle multiple possible response formats
        
        // If the response is a simple object with a token property
        if (data && typeof data === 'object' && 'token' in data && (data as any).token) {
          sessionStorage.setItem('token', (data as any).token);
        }
        // If the response is the token itself
        else if (typeof data === 'string') {
          sessionStorage.setItem('token', data);
        }
        // If the response is an object with authentication details
        else if (data && typeof data === 'object') {
          // Check if response contains authentication data
          const authData = data as Record<string, any>;
          if (authData.token) {
            sessionStorage.setItem('token', authData.token);
          } else if (authData.accessToken) {
            sessionStorage.setItem('token', authData.accessToken);
          } else if (authData.jwt) {
            sessionStorage.setItem('token', authData.jwt);
          }
        }
      }
    },
  });
};

export const useGetCurrentUserQuery = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => userService.getCurrentUser(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

// Function to clear authentication token
export const clearAuthToken = () => {
  authService.clearToken();
};

// Function to get authentication token
export const getAuthToken = () => {
  if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
    return sessionStorage.getItem('token');
  }
  return null;
};

// Function to check if user is authenticated
export const isAuthenticated = () => {
  if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
    return !!sessionStorage.getItem('token');
  }
  return false;
};

export default authService;

export { userService };