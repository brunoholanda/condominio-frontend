import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { platformAdminApi } from '../api/platform-admin.api';

export const platformAdminKeys = {
  all: ['platform-admin'] as const,
  accounts: () => [...platformAdminKeys.all, 'accounts'] as const,
  condominiums: () => [...platformAdminKeys.all, 'condominiums'] as const,
};

export function usePlatformAccountsQuery(enabled: boolean) {
  return useQuery({
    queryKey: platformAdminKeys.accounts(),
    queryFn: () => platformAdminApi.listAccounts(),
    enabled,
  });
}

export function usePlatformCondominiumsQuery(enabled: boolean) {
  return useQuery({
    queryKey: platformAdminKeys.condominiums(),
    queryFn: () => platformAdminApi.listCondominiums(),
    enabled,
  });
}

export function useSetAccountActiveMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      platformAdminApi.setAccountActive(id, active),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: platformAdminKeys.accounts() }),
  });
}

export function useSetPlatformRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      platformRole,
    }: {
      id: string;
      platformRole: 'SYSTEM_OWNER' | null;
    }) => platformAdminApi.setPlatformRole(id, platformRole),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: platformAdminKeys.accounts() }),
  });
}

export function useUpdateAccountSubscriptionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: import('../model/platform-admin.types').UpdateSubscriptionPayload;
    }) => platformAdminApi.updateSubscription(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: platformAdminKeys.accounts() }),
  });
}
