// API Services Index
// Export all API services and hooks for easy importing

// Types
export * from './types';

// API Client
export * from './apiClient';

// Error Handling
export * from './errorHandler';

// Services and their hooks
export { default as authService, 
  useLoginMutation, 
  useGetCurrentUserQuery 
} from './authService';

export { default as userService, 
  useGetAllUsersQuery, 
  useGetUserByIdQuery, 
  useCreateUserMutation, 
  useUpdateUserMutation, 
  useDeleteUserMutation,
  useUpdateCurrentUserPasswordMutation
  // Note: useGetCurrentUserQuery is from authService
} from './userService';

export { default as roleService, 
  useGetAllRolesQuery, 
  useGetRoleByIdQuery, 
  useCreateRoleMutation, 
  useUpdateRoleMutation, 
  useDeleteRoleMutation 
} from './roleService';

export { default as departmentService, 
  useGetAllDepartmentsQuery, 
  useGetDepartmentByIdQuery, 
  useCreateDepartmentMutation, 
  useUpdateDepartmentMutation, 
  useDeleteDepartmentMutation 
} from './departmentService';

export { default as serialPortService, 
  useGetAllSerialPortsQuery, 
  useUpdateSerialPortMutation 
} from './serialPortService';

export { default as serialDataService, 
  useGetLatestSerialDataQuery,
  useGetTemperatureCalibrationByMeterQuery,
  useGetPhByMeterQuery,
  useGetPhCalibrationByMeterQuery,
  useGetOrpByMeterQuery,
  useGetOrpCalibrationByMeterQuery,
  useGetMvByMeterQuery,
  useGetRecordsByFilterQuery,
  useGetDataByTimeRangeQuery,
  useGetAuditLogQuery
} from './serialDataService';

export { default as pdfRecordService, 
  useGetAllPdfRecordsQuery,
  useGetPdfRecordByIdQuery,
  useRequestSinglePdfMutation,
  useReviewPdfMutation,
  useApprovePdfMutation,
  useDownloadPdfByIdQuery,
  useDownloadCsvDataQuery
} from './pdfRecordService';

export { default as notificationService, 
  useGetNotificationsQuery,
  useCreateNotificationMutation,
  useMarkAsReadMutation,
  useDeleteNotificationMutation
} from './notificationService';

export { default as permissionService, 
  useGetAllPermissionsQuery,
  useGetPermissionsByUserQuery,
  useGetPermissionsByGroupQuery
} from './permissionService';

export { default as passwordPolicyService, 
  useGetCurrentPolicyQuery,
  useSetNewPolicyMutation
} from './passwordPolicyService';

export { default as activityLogService, 
  useGetAllLogsQuery,
  useSearchByUsernameQuery,
  useGetLogsQuery
} from './activityLogService';