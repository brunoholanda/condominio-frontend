import { httpClient } from '@/shared/api/http-client';
import type { PlanId } from '@/features/marketing/model/plans';

export const billingApi = {
  async createCheckout(plan: PlanId): Promise<{ url: string }> {
    const { data } = await httpClient.post<{ url: string }>('/billing/checkout', { plan });

    return data;
  },

  async createPortal(): Promise<{ url: string }> {
    const { data } = await httpClient.post<{ url: string }>('/billing/portal');

    return data;
  },
};
