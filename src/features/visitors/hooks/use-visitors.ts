import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { visitorsApi } from '../api/visitors.api';
import type { CreateVisitorPassPayload, VisitorPassFilters } from '../model/visitor.types';

export const visitorKeys = {
  all: ['visitors'] as const,
  list: (condoId: string, filters: VisitorPassFilters) =>
    [...visitorKeys.all, 'list', condoId, filters] as const,
};

export function useVisitorsQuery(condominiumId: string, filters: VisitorPassFilters = {}) {
  return useQuery({
    queryKey: visitorKeys.list(condominiumId, filters),
    queryFn: () => visitorsApi.list(condominiumId, filters),
  });
}

export function useCreateVisitorMutation(condominiumId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateVisitorPassPayload) => visitorsApi.create(condominiumId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: visitorKeys.all }),
  });
}

export function useCheckInVisitorMutation(condominiumId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (passId: string) => visitorsApi.checkIn(condominiumId, passId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: visitorKeys.all }),
  });
}

export function useCancelVisitorMutation(condominiumId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (passId: string) => visitorsApi.cancel(condominiumId, passId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: visitorKeys.all }),
  });
}
