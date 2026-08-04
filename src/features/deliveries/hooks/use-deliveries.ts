import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { deliveriesApi, publicDeliverySignApi } from '../api/deliveries.api';
import type {
  CreatePackagePayload,
  DeliverPackagePayload,
  PackageFilters,
} from '../model/delivery.types';

export const deliveryKeys = {
  all: ['packages'] as const,
  list: (condoId: string, filters: PackageFilters) =>
    [...deliveryKeys.all, 'list', condoId, filters] as const,
  detail: (condoId: string, id: string) => [...deliveryKeys.all, 'detail', condoId, id] as const,
};

export function usePackagesQuery(condominiumId: string, filters: PackageFilters) {
  return useQuery({
    queryKey: deliveryKeys.list(condominiumId, filters),
    queryFn: () => deliveriesApi.list(condominiumId, filters),
  });
}

interface PackageQueryOptions {
  /** Set while a signing session is open, so the desktop modal notices the delivery live. */
  refetchInterval?: number | false;
}

export function usePackageQuery(
  condominiumId: string,
  id: string | undefined,
  options: PackageQueryOptions = {},
) {
  return useQuery({
    queryKey: deliveryKeys.detail(condominiumId, id ?? ''),
    queryFn: () => deliveriesApi.getById(condominiumId, id as string),
    enabled: Boolean(id),
    refetchInterval: options.refetchInterval,
  });
}

export function useCreatePackageMutation(condominiumId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePackagePayload) => deliveriesApi.create(condominiumId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: deliveryKeys.all }),
  });
}

interface DeliverInput {
  id: string;
  payload: DeliverPackagePayload;
}

export function useDeliverPackageMutation(condominiumId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: DeliverInput) =>
      deliveriesApi.deliver(condominiumId, id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: deliveryKeys.all }),
  });
}

export function useCreateSigningSessionMutation(condominiumId: string) {
  return useMutation({
    mutationFn: (packageId: string) => deliveriesApi.createSigningSession(condominiumId, packageId),
  });
}

export function usePublicSigningSessionQuery(token: string | undefined) {
  return useQuery({
    queryKey: ['public-delivery-sign', token] as const,
    queryFn: () => publicDeliverySignApi.getSession(token as string),
    enabled: Boolean(token),
    retry: false,
  });
}

export function useCompletePublicSigningMutation(token: string) {
  return useMutation({
    mutationFn: (payload: DeliverPackagePayload) => publicDeliverySignApi.complete(token, payload),
  });
}
