import { useMutation } from '@tanstack/react-query';

import type { PlanId } from '@/features/marketing/model/plans';
import { billingApi } from '../api/billing.api';

export function useCheckoutMutation() {
  return useMutation({
    mutationFn: (plan: PlanId) => billingApi.createCheckout(plan),
  });
}

export function useBillingPortalMutation() {
  return useMutation({
    mutationFn: () => billingApi.createPortal(),
  });
}
