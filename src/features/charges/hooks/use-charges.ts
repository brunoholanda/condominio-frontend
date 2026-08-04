import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { chargesApi } from '../api/charges.api';
import type {
  ChargeFilters,
  GenerateChargesPayload,
  UpsertAsaasSettingsPayload,
} from '../model/charge.types';

export const chargeKeys = {
  all: ['charges'] as const,
  lists: (condominiumId: string) => [...chargeKeys.all, condominiumId, 'list'] as const,
  list: (condominiumId: string, filters: ChargeFilters) =>
    [...chargeKeys.lists(condominiumId), filters] as const,
  summary: (condominiumId: string) => [...chargeKeys.all, condominiumId, 'summary'] as const,
  detail: (condominiumId: string, id: string) =>
    [...chargeKeys.all, condominiumId, 'detail', id] as const,
  asaas: (condominiumId: string) => [...chargeKeys.all, condominiumId, 'asaas'] as const,
};

export function useChargesQuery(condominiumId: string, filters: ChargeFilters) {
  return useQuery({
    queryKey: chargeKeys.list(condominiumId, filters),
    queryFn: () => chargesApi.list(condominiumId, filters),
  });
}

export function useChargeSummaryQuery(condominiumId: string) {
  return useQuery({
    queryKey: chargeKeys.summary(condominiumId),
    queryFn: () => chargesApi.summary(condominiumId),
  });
}

export function useAsaasSettingsQuery(condominiumId: string) {
  return useQuery({
    queryKey: chargeKeys.asaas(condominiumId),
    queryFn: () => chargesApi.getAsaasSettings(condominiumId),
  });
}

export function useGenerateChargesMutation(condominiumId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: GenerateChargesPayload) => chargesApi.generate(condominiumId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: chargeKeys.lists(condominiumId) });
      await queryClient.invalidateQueries({ queryKey: chargeKeys.summary(condominiumId) });
    },
  });
}

export function useCancelChargeMutation(condominiumId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) =>
      chargesApi.cancel(condominiumId, id, note),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: chargeKeys.lists(condominiumId) });
      await queryClient.invalidateQueries({ queryKey: chargeKeys.summary(condominiumId) });
    },
  });
}

export function useRemindPendingChargesMutation(condominiumId: string) {
  return useMutation({
    mutationFn: () => chargesApi.remindPending(condominiumId),
  });
}

export function useUpsertAsaasSettingsMutation(condominiumId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpsertAsaasSettingsPayload) =>
      chargesApi.upsertAsaasSettings(condominiumId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: chargeKeys.asaas(condominiumId) });
    },
  });
}
