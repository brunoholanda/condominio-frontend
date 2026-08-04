export type SubscriptionPlan = 'lite' | 'prime' | 'gestor';
export type SubscriptionStatus = 'TRIALING' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED';

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  /** Somente dígitos; nulo enquanto o operador não se identificou. */
  cpf: string | null;
  platformRole: 'SYSTEM_OWNER' | null;
  isActive: boolean;
  isSystemOwner: boolean;
  plan: SubscriptionPlan;
  subscriptionStatus: SubscriptionStatus;
  trialEndsAt: string;
  subscriptionUpdatedAt: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  plan?: SubscriptionPlan;
}

/** Primeira etapa concluída: o código está a caminho da caixa de e-mail. */
export interface LoginChallenge {
  challengeId: string;
  /** E-mail parcialmente oculto, só para a pessoa reconhecer a caixa. */
  email: string;
  expiresInSeconds: number;
}

export interface ConfirmLoginPayload {
  challengeId: string;
  code: string;
}

export interface LoginResponse {
  accessToken: string;
  expiresIn: number;
  user: AuthenticatedUser;
}

export interface AuthSession {
  accessToken: string;
  user: AuthenticatedUser;
}
