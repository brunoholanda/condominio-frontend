import { httpClient } from '@/shared/api/http-client';
import type { Condominium } from '@/features/condominiums/model/condominium.types';
import type { PlatformAccount, UpdateSubscriptionPayload } from '../model/platform-admin.types';

export const platformAdminApi = {
  async listAccounts(): Promise<PlatformAccount[]> {
    const { data } = await httpClient.get<PlatformAccount[]>('/admin/accounts');

    return data;
  },

  async setAccountActive(id: string, active: boolean): Promise<PlatformAccount> {
    const { data } = await httpClient.put<PlatformAccount>(`/admin/accounts/${id}/active`, {
      active,
    });

    return data;
  },

  async setPlatformRole(
    id: string,
    platformRole: 'SYSTEM_OWNER' | null,
  ): Promise<PlatformAccount> {
    const { data } = await httpClient.put<PlatformAccount>(
      `/admin/accounts/${id}/platform-role`,
      { platformRole },
    );

    return data;
  },

  async updateSubscription(
    id: string,
    payload: UpdateSubscriptionPayload,
  ): Promise<PlatformAccount> {
    const { data } = await httpClient.patch<PlatformAccount>(
      `/admin/accounts/${id}/subscription`,
      payload,
    );

    return data;
  },

  async listCondominiums(): Promise<Condominium[]> {
    const { data } = await httpClient.get<Condominium[]>('/admin/condominiums');

    return data;
  },
};
