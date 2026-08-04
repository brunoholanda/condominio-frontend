import { httpClient } from '@/shared/api/http-client';

import type {
  CreateWorkOrderPayload,
  UpdateWorkOrderStatusPayload,
  WorkOrder,
  WorkOrderFilters,
} from '../model/work-order.types';

function resource(condominiumId: string): string {
  return `/condominiums/${condominiumId}/work-orders`;
}

export const workOrdersApi = {
  async list(condominiumId: string, filters: WorkOrderFilters = {}): Promise<WorkOrder[]> {
    const { data } = await httpClient.get<WorkOrder[]>(resource(condominiumId), {
      params: filters,
    });

    return data;
  },

  async create(condominiumId: string, payload: CreateWorkOrderPayload): Promise<WorkOrder> {
    const { data } = await httpClient.post<WorkOrder>(resource(condominiumId), payload);

    return data;
  },

  async updateStatus(
    condominiumId: string,
    orderId: string,
    payload: UpdateWorkOrderStatusPayload,
  ): Promise<WorkOrder> {
    const { data } = await httpClient.patch<WorkOrder>(
      `${resource(condominiumId)}/${orderId}/status`,
      payload,
    );

    return data;
  },
};
