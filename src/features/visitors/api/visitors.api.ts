import { httpClient } from '@/shared/api/http-client';

import type {
  CreateVisitorPassPayload,
  VisitorPass,
  VisitorPassFilters,
} from '../model/visitor.types';

function resource(condominiumId: string): string {
  return `/condominiums/${condominiumId}/visitors`;
}

export const visitorsApi = {
  async list(condominiumId: string, filters: VisitorPassFilters = {}): Promise<VisitorPass[]> {
    const { data } = await httpClient.get<VisitorPass[]>(resource(condominiumId), {
      params: filters,
    });

    return data;
  },

  async create(condominiumId: string, payload: CreateVisitorPassPayload): Promise<VisitorPass> {
    const { data } = await httpClient.post<VisitorPass>(resource(condominiumId), payload);

    return data;
  },

  async checkIn(condominiumId: string, passId: string): Promise<VisitorPass> {
    const { data } = await httpClient.post<VisitorPass>(
      `${resource(condominiumId)}/${passId}/check-in`,
    );

    return data;
  },

  async cancel(condominiumId: string, passId: string): Promise<VisitorPass> {
    const { data } = await httpClient.post<VisitorPass>(
      `${resource(condominiumId)}/${passId}/cancel`,
    );

    return data;
  },
};
