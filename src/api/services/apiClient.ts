import { QueryClient } from '@tanstack/react-query';

// Create a global query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

// Base URL for API calls
const BASE_URL = 'http://75.119.131.124:8080';

// Get authentication token from sessionStorage
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
    return sessionStorage.getItem('token');
  }
  return null;
};

// API client with interceptors
export class ApiClient {
  private baseUrl: string = BASE_URL;

  // Generic request method
  protected async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add authorization header if token exists
    const token = getAuthToken();
    if (token && !options.headers?.['Authorization']) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Handle different response types
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else if (contentType && contentType.includes('application/octet-stream')) {
        return await response.blob() as unknown as T;
      } else {
        // For non-JSON responses (e.g., file downloads)
        return response.text() as unknown as T;
      }
    } catch (error) {
      console.error(`API request error for ${url}:`, error);
      throw error;
    }
  }

  // Helper methods for different HTTP methods
  protected get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const queryString = params 
      ? `?${new URLSearchParams(params).toString()}`
      : '';
    
    return this.request<T>(`${endpoint}${queryString}`, {
      method: 'GET',
    });
  }

  protected post<T>(endpoint: string, data?: any, params?: Record<string, any>): Promise<T> {
    const queryString = params 
      ? `?${new URLSearchParams(params).toString()}`
      : '';
    
    return this.request<T>(`${endpoint}${queryString}`, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  protected put<T>(endpoint: string, data?: any, params?: Record<string, any>): Promise<T> {
    const queryString = params 
      ? `?${new URLSearchParams(params).toString()}`
      : '';
    
    return this.request<T>(`${endpoint}${queryString}`, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  protected delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  protected download(endpoint: string): Promise<Blob> {
    return this.request<Blob>(endpoint, {
      headers: {
        'Accept': 'application/octet-stream'
      }
    });
  }
}

// Authentication API client (doesn't require authorization header)
export class AuthApiClient {
  private baseUrl: string = BASE_URL;

  protected async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Handle different response types
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return response.text() as unknown as T;
      }
    } catch (error) {
      console.error(`API request error for ${url}:`, error);
      throw error;
    }
  }

  protected post<T>(endpoint: string, data?: any, params?: Record<string, any>): Promise<T> {
    const queryString = params 
      ? `?${new URLSearchParams(params).toString()}`
      : '';
    
    return this.request<T>(`${endpoint}${queryString}`, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}