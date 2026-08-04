import { httpClient } from '@/shared/api/http-client';
import type { CondoDocument, DocumentPayload } from '../model/document.types';

function resource(condominiumId: string): string {
  return `/condominiums/${condominiumId}/documents`;
}

export const documentsApi = {
  async list(condominiumId: string): Promise<CondoDocument[]> {
    const { data } = await httpClient.get<CondoDocument[]>(resource(condominiumId));

    return data;
  },

  async getById(condominiumId: string, id: string): Promise<CondoDocument> {
    const { data } = await httpClient.get<CondoDocument>(`${resource(condominiumId)}/${id}`);

    return data;
  },

  async create(condominiumId: string, payload: DocumentPayload): Promise<CondoDocument> {
    const { data } = await httpClient.post<CondoDocument>(resource(condominiumId), payload);

    return data;
  },

  async update(
    condominiumId: string,
    id: string,
    payload: Partial<DocumentPayload>,
  ): Promise<CondoDocument> {
    const { data } = await httpClient.put<CondoDocument>(`${resource(condominiumId)}/${id}`, payload);

    return data;
  },

  async remove(condominiumId: string, id: string): Promise<void> {
    await httpClient.delete(`${resource(condominiumId)}/${id}`);
  },

  /** Lista pública, usada em `/c/:slug/documentos`. */
  async listPublic(slug: string): Promise<CondoDocument[]> {
    const { data } = await httpClient.get<CondoDocument[]>(`/c/${slug}/documents`);

    return data;
  },

  async getPublicById(slug: string, id: string): Promise<CondoDocument> {
    const { data } = await httpClient.get<CondoDocument>(`/c/${slug}/documents/${id}`);

    return data;
  },
};
