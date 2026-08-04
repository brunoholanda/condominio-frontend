import { httpClient } from '@/shared/api/http-client';
import type { CommonArea, CommonAreaPayload } from '../model/common-area.types';

function resource(condominiumId: string): string {
  return `/condominiums/${condominiumId}/common-areas`;
}

export const commonAreasApi = {
  async list(condominiumId: string): Promise<CommonArea[]> {
    const { data } = await httpClient.get<CommonArea[]>(resource(condominiumId));

    return data;
  },

  async create(condominiumId: string, payload: CommonAreaPayload): Promise<CommonArea> {
    const { data } = await httpClient.post<CommonArea>(resource(condominiumId), payload);

    return data;
  },

  async update(
    condominiumId: string,
    areaId: string,
    payload: CommonAreaPayload,
  ): Promise<CommonArea> {
    const { data } = await httpClient.put<CommonArea>(`${resource(condominiumId)}/${areaId}`, payload);

    return data;
  },

  async remove(condominiumId: string, areaId: string): Promise<void> {
    await httpClient.delete(`${resource(condominiumId)}/${areaId}`);
  },

  /** Áreas ativas do condomínio, visíveis sem login. */
  async listPublic(slug: string): Promise<CommonArea[]> {
    const { data } = await httpClient.get<CommonArea[]>(`/c/${slug}/common-areas`);

    return data;
  },
};
