import { httpClient } from '@/shared/api/http-client';
import type { UsefulContact, UsefulContactPayload } from '../model/contact.types';

function resource(condominiumId: string): string {
  return `/condominiums/${condominiumId}/contacts`;
}

export const contactsApi = {
  async list(condominiumId: string): Promise<UsefulContact[]> {
    const { data } = await httpClient.get<UsefulContact[]>(resource(condominiumId));

    return data;
  },

  async create(condominiumId: string, payload: UsefulContactPayload): Promise<UsefulContact> {
    const { data } = await httpClient.post<UsefulContact>(resource(condominiumId), payload);

    return data;
  },

  async update(
    condominiumId: string,
    id: string,
    payload: Partial<UsefulContactPayload>,
  ): Promise<UsefulContact> {
    const { data } = await httpClient.put<UsefulContact>(`${resource(condominiumId)}/${id}`, payload);

    return data;
  },

  async remove(condominiumId: string, id: string): Promise<void> {
    await httpClient.delete(`${resource(condominiumId)}/${id}`);
  },

  async reorder(condominiumId: string, orderedIds: string[]): Promise<UsefulContact[]> {
    const { data } = await httpClient.put<UsefulContact[]>(`${resource(condominiumId)}/reorder`, {
      orderedIds,
    });

    return data;
  },

  /** Lista pública, usada no hub `/c/:slug`. */
  async listPublic(slug: string): Promise<UsefulContact[]> {
    const { data } = await httpClient.get<UsefulContact[]>(`/c/${slug}/contacts`);

    return data;
  },
};
