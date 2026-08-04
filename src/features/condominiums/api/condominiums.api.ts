import { httpClient } from '@/shared/api/http-client';
import type { DownloadedFile } from '@/shared/utils/download-file';
import { fileNameFromDisposition } from '@/shared/utils/download-file';
import type {
  AddCondoMemberPayload,
  CondoMember,
  Condominium,
  CondominiumPayload,
  MembershipRole,
  PublicCondominium,
  UpdateCondominiumPayload,
} from '../model/condominium.types';
import type { PublicQrTarget } from '../model/public-qr.types';

export interface GeocodeSuggestion {
  displayName: string;
  latitude: number;
  longitude: number;
  address?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

const RESOURCE = '/condominiums';

export const condominiumsApi = {
  async list(): Promise<Condominium[]> {
    const { data } = await httpClient.get<Condominium[]>(RESOURCE);

    return data;
  },

  async create(payload: CondominiumPayload): Promise<Condominium> {
    const { data } = await httpClient.post<Condominium>(RESOURCE, payload);

    return data;
  },

  async getById(id: string): Promise<Condominium> {
    const { data } = await httpClient.get<Condominium>(`${RESOURCE}/${id}`);

    return data;
  },

  async update(id: string, payload: UpdateCondominiumPayload): Promise<Condominium> {
    const { data } = await httpClient.put<Condominium>(`${RESOURCE}/${id}`, payload);

    return data;
  },

  /** Resolve endereço → lat/lng via Nominatim (proxy no backend). */
  async geocode(address: string): Promise<GeocodeSuggestion> {
    const { data } = await httpClient.get<GeocodeSuggestion>('/geocode', {
      params: { q: address },
    });

    return data;
  },

  /** Sugestões de endereço enquanto o usuário digita. */
  async suggestAddresses(query: string): Promise<GeocodeSuggestion[]> {
    const { data } = await httpClient.get<GeocodeSuggestion[]>('/geocode/suggest', {
      params: { q: query },
    });

    return data;
  },

  /** Localiza endereço e coordenadas pelo CEP (ViaCEP + Nominatim). */
  async lookupCep(cep: string): Promise<GeocodeSuggestion> {
    const digits = cep.replace(/\D/g, '');
    const { data } = await httpClient.get<GeocodeSuggestion>(`/geocode/cep/${digits}`);

    return data;
  },

  async getUnits(id: string): Promise<string[]> {
    const { data } = await httpClient.get<string[]>(`${RESOURCE}/${id}/units`);

    return data;
  },

  /** PDF A4 com QR Code do link público, moldura e nome do condomínio no rodapé. */
  async downloadPublicQrPdf(id: string, target: PublicQrTarget = 'hub'): Promise<DownloadedFile> {
    const response = await httpClient.get<Blob>(`${RESOURCE}/${id}/qr-code`, {
      params: { target },
      responseType: 'blob',
    });

    return {
      blob: response.data,
      fileName: fileNameFromDisposition(
        response.headers['content-disposition'],
        `qr-${target}.pdf`,
      ),
    };
  },

  /** Perfil público do condomínio, usado pelo hub `/c/:slug` e pelos formulários. */
  async getPublicBySlug(slug: string): Promise<PublicCondominium> {
    const { data } = await httpClient.get<PublicCondominium>(`/c/${slug}`);

    return data;
  },

  async getPublicUnits(slug: string): Promise<string[]> {
    const { data } = await httpClient.get<string[]>(`/c/${slug}/units`);

    return data;
  },

  async listMembers(condominiumId: string): Promise<CondoMember[]> {
    const { data } = await httpClient.get<CondoMember[]>(`${RESOURCE}/${condominiumId}/members`);

    return data;
  },

  async addMember(condominiumId: string, payload: AddCondoMemberPayload): Promise<CondoMember> {
    const { data } = await httpClient.post<CondoMember>(
      `${RESOURCE}/${condominiumId}/members`,
      payload,
    );

    return data;
  },

  async updateMemberRole(
    condominiumId: string,
    membershipId: string,
    role: MembershipRole,
  ): Promise<CondoMember> {
    const { data } = await httpClient.put<CondoMember>(
      `${RESOURCE}/${condominiumId}/members/${membershipId}`,
      { role },
    );

    return data;
  },

  async removeMember(condominiumId: string, membershipId: string): Promise<void> {
    await httpClient.delete(`${RESOURCE}/${condominiumId}/members/${membershipId}`);
  },
};
