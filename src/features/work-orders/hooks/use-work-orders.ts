import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { workOrdersApi } from '../api/work-orders.api';
import type {
  CreateWorkOrderPayload,
  UpdateWorkOrderStatusPayload,
  WorkOrderFilters,
} from '../model/work-order.types';

export const workOrderKeys = {
  all: ['work-orders'] as const,
  list: (condoId: string, filters: WorkOrderFilters) =>
    [...workOrderKeys.all, 'list', condoId, filters] as const,
};

export function useWorkOrdersQuery(condominiumId: string, filters: WorkOrderFilters = {}) {
  return useQuery({
    queryKey: workOrderKeys.list(condominiumId, filters),
    queryFn: () => workOrdersApi.list(condominiumId, filters),
  });
}

export function useCreateWorkOrderMutation(condominiumId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateWorkOrderPayload) => workOrdersApi.create(condominiumId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: workOrderKeys.all }),
  });
}

export function useUpdateWorkOrderStatusMutation(condominiumId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      payload,
    }: {
      orderId: string;
      payload: UpdateWorkOrderStatusPayload;
    }) => workOrdersApi.updateStatus(condominiumId, orderId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: workOrderKeys.all }),
  });
}
