import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PasswordPolicy } from './types';
import { ApiClient } from './apiClient';

class PasswordPolicyService extends ApiClient {
  // Get current password policy
  getCurrentPolicy = () => {
    return this.get<PasswordPolicy>('/api/password-policy');
  };

  // Set new password policy
  setNewPolicy = (policy: PasswordPolicy) => {
    const params: Record<string, any> = {
      'policy.numberOfDays': policy.numberOfDays
    };
    
    if (policy.id) {
      params['policy.id'] = policy.id;
    }
    
    if (policy.sessionExpireTime) {
      params['policy.sessionExpireTime'] = policy.sessionExpireTime;
    }
    
    return this.put<PasswordPolicy>('/api/password-policy', undefined, params);
  };
}

const passwordPolicyService = new PasswordPolicyService();

// React Query hooks for password policy
export const useGetCurrentPolicyQuery = () => {
  return useQuery({
    queryKey: ['passwordPolicy'],
    queryFn: () => passwordPolicyService.getCurrentPolicy(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSetNewPolicyMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (policy: PasswordPolicy) => passwordPolicyService.setNewPolicy(policy),
    onSuccess: () => {
      // Invalidate and refetch password policy query
      queryClient.invalidateQueries({ queryKey: ['passwordPolicy'] });
    },
  });
};

export default passwordPolicyService;