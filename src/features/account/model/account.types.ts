export type SubscriptionPlanId = 'lite' | 'prime' | 'gestor';
export type SubscriptionStatusId = 'TRIALING' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED';

export const SUBSCRIPTION_STATUS_LABELS: Record<SubscriptionStatusId, string> = {
  TRIALING: 'Em teste',
  ACTIVE: 'Ativa (paga)',
  PAST_DUE: 'Pagamento em atraso',
  CANCELED: 'Cancelada',
};

export const SUBSCRIPTION_STATUS_COLORS: Record<SubscriptionStatusId, string> = {
  TRIALING: 'blue',
  ACTIVE: 'green',
  PAST_DUE: 'orange',
  CANCELED: 'default',
};

export function trialDaysRemaining(trialEndsAt: string, now = new Date()): number {
  const ends = new Date(trialEndsAt).getTime();
  const diff = ends - now.getTime();

  return Math.max(0, Math.ceil(diff / (24 * 60 * 60 * 1000)));
}
