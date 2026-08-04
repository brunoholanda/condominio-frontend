import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { residentAccountsApi } from '../api/resident-accounts.api';
import type { CreateResidentAccountPayload } from '../model/common-area.types';

export const residentAccountKeys = {
  all: (condominiumId: string) => ['resident-accounts', condominiumId] as const,
};

export function useResidentAccountsQuery(condominiumId: string) {
  return useQuery({
    queryKey: residentAccountKeys.all(condominiumId),
    queryFn: () => residentAccountsApi.list(condominiumId),
    enabled: Boolean(condominiumId),
  });
}

export function useCreateResidentAccountMutation(condominiumId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateResidentAccountPayload) =>
      residentAccountsApi.create(condominiumId, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: residentAccountKeys.all(condominiumId) }),
  });
}
