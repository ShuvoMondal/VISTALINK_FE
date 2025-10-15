// Error handling utilities for API calls
export class ApiError extends Error {
  public status: number;
  public data?: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'ApiError';
  }
}

// Global error handler
export const handleApiError = (error: any): ApiError => {
  if (error instanceof ApiError) {
    return error;
  }

  if (error.status) {
    return new ApiError(
      `API request failed with status ${error.status}`,
      error.status,
      error.data || error.message
    );
  }

  return new ApiError(
    error.message || 'An unexpected error occurred',
    0
  );
};

// Type guard for error checking
export const isApiError = (error: any): error is ApiError => {
  return error instanceof ApiError;
};