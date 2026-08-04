export type PlatformPlan = 'lite' | 'prime' | 'gestor';
export type PlatformSubscriptionStatus = 'TRIALING' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED';

export interface PlatformAccount {
  id: string;
  name: string;
  email: string;
  cpf: string | null;
  platformRole: 'SYSTEM_OWNER' | null;
  isActive: boolean;
  isSystemOwner: boolean;
  plan: PlatformPlan;
  subscriptionStatus: PlatformSubscriptionStatus;
  trialEndsAt: string;
  subscriptionUpdatedAt: string | null;
  createdAt: string;
}

export interface UpdateSubscriptionPayload {
  plan?: PlatformPlan;
  status?: PlatformSubscriptionStatus;
}
