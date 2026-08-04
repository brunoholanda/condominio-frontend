import { httpClient } from '@/shared/api/http-client';
import type {
  CompletePublicSigningResult,
  CondoPackage,
  CreatePackagePayload,
  DeliverPackagePayload,
  PackageFilters,
  PaginatedPackages,
  PublicSigningSession,
  SigningSession,
} from '../model/delivery.types';

function resource(condominiumId: string): string {
  return `/condominiums/${condominiumId}/packages`;
}

export const deliveriesApi = {
  async list(condominiumId: string, filters: PackageFilters): Promise<PaginatedPackages> {
    const { data } = await httpClient.get<PaginatedPackages>(resource(condominiumId), {
      params: filters,
    });

    return data;
  },

  async getById(condominiumId: string, id: string): Promise<CondoPackage> {
    const { data } = await httpClient.get<CondoPackage>(`${resource(condominiumId)}/${id}`);

    return data;
  },

  async create(condominiumId: string, payload: CreatePackagePayload): Promise<CondoPackage> {
    const { data } = await httpClient.post<CondoPackage>(resource(condominiumId), payload);

    return data;
  },

  async deliver(
    condominiumId: string,
    id: string,
    payload: DeliverPackagePayload,
  ): Promise<CondoPackage> {
    const { data } = await httpClient.post<CondoPackage>(
      `${resource(condominiumId)}/${id}/deliver`,
      payload,
    );

    return data;
  },

  async createSigningSession(condominiumId: string, id: string): Promise<SigningSession> {
    const { data } = await httpClient.post<SigningSession>(
      `${resource(condominiumId)}/${id}/signing-session`,
    );

    return data;
  },
};

/** Público, sem autenticação: assinatura remota aberta a partir do QR Code. */
export const publicDeliverySignApi = {
  async getSession(token: string): Promise<PublicSigningSession> {
    const { data } = await httpClient.get<PublicSigningSession>(`/public/delivery-sign/${token}`);

    return data;
  },

  async complete(
    token: string,
    payload: DeliverPackagePayload,
  ): Promise<CompletePublicSigningResult> {
    const { data } = await httpClient.post<CompletePublicSigningResult>(
      `/public/delivery-sign/${token}`,
      payload,
    );

    return data;
  },
};
