import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SerialPortConfig } from './types';
import { ApiClient } from './apiClient';

class SerialPortService extends ApiClient {
  // Get all serial ports
  getAllSerialPorts = () => {
    return this.get<SerialPortConfig[]>('/api/serial-ports');
  };

  // Update serial port configuration
  updateSerialPort = (id: number, config: SerialPortConfig) => {
    return this.put<SerialPortConfig>(`/api/serial-ports/${id}`, config);
  };
}

const serialPortService = new SerialPortService();

// React Query hooks for serial port management
export const useGetAllSerialPortsQuery = () => {
  return useQuery({
    queryKey: ['serialPorts'],
    queryFn: () => serialPortService.getAllSerialPorts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateSerialPortMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, config }: { id: number; config: SerialPortConfig }) => 
      serialPortService.updateSerialPort(id, config),
    onSuccess: () => {
      // Invalidate and refetch serial port queries
      queryClient.invalidateQueries({ queryKey: ['serialPorts'] });
    },
  });
};

export default serialPortService;