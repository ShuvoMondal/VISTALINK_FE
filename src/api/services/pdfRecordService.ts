import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  PdfRecord, 
  PdfRecordRequestParams, 
  ReviewPdfParams, 
  ApprovePdfParams 
} from './types';
import { ApiClient } from './apiClient';

class PdfRecordService extends ApiClient {
  // Get all PDF records
  getAllPdfRecords = () => {
    return this.get<PdfRecord[]>('/api/pdf-records');
  };

  // Get PDF record by ID
  getPdfRecordById = (id: number) => {
    return this.get<PdfRecord>(`/api/pdf-records/${id}`);
  };

  // Request single PDF
  requestSinglePdf = (params: PdfRecordRequestParams) => {
    const { requesterId, dataId, dataType, requestReason } = params;
    const queryParams: Record<string, any> = {
      requesterId,
      dataId,
      dataType
    };
    
    if (requestReason) {
      queryParams.requestReason = requestReason;
    }
    
    return this.post<PdfRecord>('/api/pdf-records/request/single', undefined, queryParams);
  };

  // Review PDF
  reviewPdf = (params: ReviewPdfParams) => {
    const { pdfRecordId, reviewerUserId, reviewStatus, reviewReason } = params;
    const queryParams: Record<string, any> = {
      reviewerUserId,
      reviewStatus
    };
    
    if (reviewReason) {
      queryParams.reviewReason = reviewReason;
    }
    
    return this.put<PdfRecord>(`/api/pdf-records/${pdfRecordId}/review`, undefined, queryParams);
  };

  // Approve PDF
  approvePdf = (params: ApprovePdfParams) => {
    const { pdfRecordId, approverUserId, approvalStatus, approveReason } = params;
    const queryParams: Record<string, any> = {
      approverUserId,
      approvalStatus
    };
    
    if (approveReason) {
      queryParams.approveReason = approveReason;
    }
    
    return this.put<{}>(`/api/pdf-records/${pdfRecordId}/approve`, undefined, queryParams);
  };

  // Download PDF by ID
  downloadPdfById = (id: number) => {
    return this.get<string>(`/api/pdf-records/${id}/download`);
  };

  // Download CSV data
  downloadCsvData = (id: number) => {
    return this.get<string>(`/api/pdf-records/${id}/csvDownload`);
  };
}

const pdfRecordService = new PdfRecordService();

// React Query hooks for PDF records
export const useGetAllPdfRecordsQuery = () => {
  return useQuery({
    queryKey: ['pdfRecords'],
    queryFn: async () => {
      const response = await pdfRecordService.getAllPdfRecords();
      // Handle both paginated and plain array responses
      return response?.content || response || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetPdfRecordByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ['pdfRecord', id],
    queryFn: async () => {
      const response = await pdfRecordService.getPdfRecordById(id);
      // Handle both paginated and plain object responses
      return response?.content || response;
    },
    enabled: !!id,
  });
};

export const useRequestSinglePdfMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (params: PdfRecordRequestParams) => pdfRecordService.requestSinglePdf(params),
    onSuccess: () => {
      // Invalidate and refetch PDF record queries
      queryClient.invalidateQueries({ queryKey: ['pdfRecords'] });
    },
  });
};

export const useReviewPdfMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (params: ReviewPdfParams) => pdfRecordService.reviewPdf(params),
    onSuccess: (_, { pdfRecordId }) => {
      // Invalidate and refetch the specific PDF record
      queryClient.invalidateQueries({ queryKey: ['pdfRecord', pdfRecordId] });
      queryClient.invalidateQueries({ queryKey: ['pdfRecords'] });
    },
  });
};

export const useApprovePdfMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (params: ApprovePdfParams) => pdfRecordService.approvePdf(params),
    onSuccess: (_, { pdfRecordId }) => {
      // Invalidate and refetch the specific PDF record
      queryClient.invalidateQueries({ queryKey: ['pdfRecord', pdfRecordId] });
      queryClient.invalidateQueries({ queryKey: ['pdfRecords'] });
    },
  });
};

export const useDownloadPdfByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ['pdfDownload', id],
    queryFn: () => pdfRecordService.downloadPdfById(id),
    enabled: !!id,
  });
};

export const useDownloadCsvDataQuery = (id: number) => {
  return useQuery({
    queryKey: ['csvDownload', id],
    queryFn: () => pdfRecordService.downloadCsvData(id),
    enabled: !!id,
  });
};

export default pdfRecordService;