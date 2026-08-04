import { httpClient } from '@/shared/api/http-client';
import type {
  AsaasSettings,
  Charge,
  ChargeFilters,
  ChargeSummary,
  GenerateChargesPayload,
  GenerateChargesResult,
  PaginatedCharges,
  UpsertAsaasSettingsPayload,
} from '../model/charge.types';

function base(condominiumId: string): string {
  return `/condominiums/${condominiumId}`;
}

export const chargesApi = {
  async list(condominiumId: string, filters: ChargeFilters): Promise<PaginatedCharges> {
    const { data } = await httpClient.get<PaginatedCharges>(`${base(condominiumId)}/charges`, {
      params: filters,
    });
    return data;
  },

  async summary(condominiumId: string): Promise<ChargeSummary> {
    const { data } = await httpClient.get<ChargeSummary>(`${base(condominiumId)}/charges/summary`);
    return data;
  },

  async getById(condominiumId: string, id: string): Promise<Charge> {
    const { data } = await httpClient.get<Charge>(`${base(condominiumId)}/charges/${id}`);
    return data;
  },

  async generate(
    condominiumId: string,
    payload: GenerateChargesPayload,
  ): Promise<GenerateChargesResult> {
    const { data } = await httpClient.post<GenerateChargesResult>(
      `${base(condominiumId)}/charge-batches`,
      payload,
    );
    return data;
  },

  async cancel(condominiumId: string, id: string, note?: string): Promise<Charge> {
    const { data } = await httpClient.post<Charge>(`${base(condominiumId)}/charges/${id}/cancel`, {
      note,
    });
    return data;
  },

  async remindPending(
    condominiumId: string,
  ): Promise<{ notifiedUsers: number; pendingCharges: number }> {
    const { data } = await httpClient.post<{ notifiedUsers: number; pendingCharges: number }>(
      `${base(condominiumId)}/charges/remind-pending`,
    );
    return data;
  },

  async getAsaasSettings(condominiumId: string): Promise<AsaasSettings> {
    const { data } = await httpClient.get<AsaasSettings>(`${base(condominiumId)}/asaas-settings`);
    return data;
  },

  async upsertAsaasSettings(
    condominiumId: string,
    payload: UpsertAsaasSettingsPayload,
  ): Promise<AsaasSettings> {
    const { data } = await httpClient.put<AsaasSettings>(
      `${base(condominiumId)}/asaas-settings`,
      payload,
    );
    return data;
  },
};
