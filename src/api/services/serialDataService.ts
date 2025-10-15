import { useQuery } from '@tanstack/react-query';
import { 
  PageSerialDataRecord, 
  PageTemperatureCalibration, 
  PagePh, 
  PagePhCalibration, 
  PageOrp, 
  PageOrpCalibration, 
  PageMv,
  GetDataByMeterParams,
  GetDataByTimeRangeParams,
  GetDataByFilterParams
} from './types';
import { ApiClient } from './apiClient';

class SerialDataService extends ApiClient {
  // Get latest serial data
  getLatestSerialData = (pageable: { page: number; size: number }) => {
    return this.get<PageSerialDataRecord>('/api/serial-data', {
      page: pageable.page,
      size: pageable.size
    });
  };

  // Get temperature calibration data by meter
  getTemperatureCalibrationByMeter = (params: GetDataByMeterParams) => {
    const { meterNumber, page = 0, size = 10 } = params;
    return this.get<PageTemperatureCalibration>('/api/serial-data/temperatureCalibration', {
      meterNumber,
      page,
      size
    });
  };

  // Get pH data by meter
  getPhByMeter = (params: GetDataByMeterParams) => {
    const { meterNumber, page = 0, size = 10 } = params;
    return this.get<PagePh>('/api/serial-data/ph', {
      meterNumber,
      page,
      size
    });
  };

  // Get pH calibration data by meter
  getPhCalibrationByMeter = (params: GetDataByMeterParams) => {
    const { meterNumber, page = 0, size = 10 } = params;
    return this.get<PagePhCalibration>('/api/serial-data/phCalibration', {
      meterNumber,
      page,
      size
    });
  };

  // Get ORP data by meter
  getOrpByMeter = (params: GetDataByMeterParams) => {
    const { meterNumber, page = 0, size = 10 } = params;
    return this.get<PageOrp>('/api/serial-data/orp', {
      meterNumber,
      page,
      size
    });
  };

  // Get ORP calibration data by meter
  getOrpCalibrationByMeter = (params: GetDataByMeterParams) => {
    const { meterNumber, page = 0, size = 10 } = params;
    return this.get<PageOrpCalibration>('/api/serial-data/orpCalibration', {
      meterNumber,
      page,
      size
    });
  };

  // Get MV data by meter
  getMvByMeter = (params: GetDataByMeterParams) => {
    const { meterNumber, page = 0, size = 10 } = params;
    return this.get<PageMv>('/api/serial-data/mv', {
      meterNumber,
      page,
      size
    });
  };

  // Get records by filter (meter, type, time range)
  getRecordsByFilter = (params: GetDataByFilterParams) => {
    const { meterNumber, dataType, start, end, page = 0, size = 20 } = params;
    return this.get<any>('/api/serial-data/filter', {
      meterNumber,
      dataType,
      start,
      end,
      page,
      size
    });
  };

  // Get data by time range (legacy)
  getDataByTimeRange = (params: GetDataByTimeRangeParams) => {
    const { start, end, page, size } = params;
    return this.get<PageSerialDataRecord>('/api/serial-data/filterOld', {
      start,
      end,
      page,
      size
    });
  };

  // Get audit log
  getAuditLog = (page: number = 0, size: number = 10) => {
    return this.get<any>('/api/serial-data/auditLog', {
      page,
      size
    });
  };
}

const serialDataService = new SerialDataService();

// React Query hooks for serial data
export const useGetLatestSerialDataQuery = (pageable: { page: number; size: number }) => {
  return useQuery({
    queryKey: ['latestSerialData', pageable.page, pageable.size],
    queryFn: async () => {
      const response = await serialDataService.getLatestSerialData(pageable);
      // Handle both paginated and plain array responses
      return response?.content || response || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetTemperatureCalibrationByMeterQuery = (params: GetDataByMeterParams) => {
  return useQuery({
    queryKey: ['temperatureCalibration', params.meterNumber, params.page, params.size],
    queryFn: async () => {
      const response = await serialDataService.getTemperatureCalibrationByMeter(params);
      // Handle both paginated and plain array responses
      return response?.content || response || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetPhByMeterQuery = (params: GetDataByMeterParams) => {
  return useQuery({
    queryKey: ['ph', params.meterNumber, params.page, params.size],
    queryFn: async () => {
      const response = await serialDataService.getPhByMeter(params);
      // Handle both paginated and plain array responses
      return response?.content || response || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetPhCalibrationByMeterQuery = (params: GetDataByMeterParams) => {
  return useQuery({
    queryKey: ['phCalibration', params.meterNumber, params.page, params.size],
    queryFn: async () => {
      const response = await serialDataService.getPhCalibrationByMeter(params);
      // Handle both paginated and plain array responses
      return response?.content || response || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetOrpByMeterQuery = (params: GetDataByMeterParams) => {
  return useQuery({
    queryKey: ['orp', params.meterNumber, params.page, params.size],
    queryFn: async () => {
      const response = await serialDataService.getOrpByMeter(params);
      // Handle both paginated and plain array responses
      return response?.content || response || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetOrpCalibrationByMeterQuery = (params: GetDataByMeterParams) => {
  return useQuery({
    queryKey: ['orpCalibration', params.meterNumber, params.page, params.size],
    queryFn: async () => {
      const response = await serialDataService.getOrpCalibrationByMeter(params);
      // Handle both paginated and plain array responses
      return response?.content || response || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetMvByMeterQuery = (params: GetDataByMeterParams) => {
  return useQuery({
    queryKey: ['mv', params.meterNumber, params.page, params.size],
    queryFn: async () => {
      const response = await serialDataService.getMvByMeter(params);
      // Handle both paginated and plain array responses
      return response?.content || response || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetRecordsByFilterQuery = (params: GetDataByFilterParams) => {
  return useQuery({
    queryKey: ['recordsFilter', params.meterNumber, params.dataType, params.start, params.end, params.page, params.size],
    queryFn: async () => {
      const response = await serialDataService.getRecordsByFilter(params);
      // Handle both paginated and plain array responses
      return response?.content || response || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetDataByTimeRangeQuery = (params: GetDataByTimeRangeParams) => {
  return useQuery({
    queryKey: ['dataByTimeRange', params.start, params.end, params.page, params.size],
    queryFn: async () => {
      const response = await serialDataService.getDataByTimeRange(params);
      // Handle both paginated and plain array responses
      return response?.content || response || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetAuditLogQuery = (page: number = 0, size: number = 10) => {
  return useQuery({
    queryKey: ['auditLog', page, size],
    queryFn: async () => {
      const response = await serialDataService.getAuditLog(page, size);
      // Handle both paginated and plain array responses
      return response?.content || response || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export default serialDataService;