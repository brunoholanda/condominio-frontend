import { httpClient } from '@/shared/api/http-client';
import type { CreateResidentAccountPayload, ResidentAccount } from '../model/common-area.types';

function resource(condominiumId: string): string {
  return `/condominiums/${condominiumId}/resident-accounts`;
}

export const residentAccountsApi = {
  async list(condominiumId: string): Promise<ResidentAccount[]> {
    const { data } = await httpClient.get<ResidentAccount[]>(resource(condominiumId));

    return data;
  },

  async create(
    condominiumId: string,
    payload: CreateResidentAccountPayload,
  ): Promise<ResidentAccount> {
    const { data } = await httpClient.post<ResidentAccount>(resource(condominiumId), payload);

    return data;
  },
};
