import { httpClient } from '@/shared/api/http-client';
import type { FormerResidentDetail, FormerResidentListItem } from '../model/former-resident.types';

function resource(condominiumId: string): string {
  return `/condominiums/${condominiumId}/former-residents`;
}

export const formerResidentsApi = {
  async list(condominiumId: string, unit?: string): Promise<FormerResidentListItem[]> {
    const { data } = await httpClient.get<FormerResidentListItem[]>(resource(condominiumId), {
      params: unit ? { unit } : undefined,
    });

    return data;
  },

  async getById(condominiumId: string, recordId: string): Promise<FormerResidentDetail> {
    const { data } = await httpClient.get<FormerResidentDetail>(
      `${resource(condominiumId)}/${recordId}`,
    );

    return data;
  },
};
