import { httpClient } from '@/shared/api/http-client';
import type {
  AuthenticatedUser,
  ConfirmLoginPayload,
  LoginChallenge,
  LoginPayload,
  LoginResponse,
  RegisterPayload,
} from '../model/auth.types';

const RESOURCE = '/auth';

export const authApi = {
  /** Cria a conta. O acesso ainda depende do login em duas etapas. */
  async register(payload: RegisterPayload): Promise<AuthenticatedUser> {
    const { data } = await httpClient.post<AuthenticatedUser>(`${RESOURCE}/register`, payload);

    return data;
  },

  /** Primeira etapa: valida as credenciais e dispara o código por e-mail. */
  async login(payload: LoginPayload): Promise<LoginChallenge> {
    const { data } = await httpClient.post<LoginChallenge>(`${RESOURCE}/login`, payload);

    return data;
  },

  /** Segunda etapa: o código correto é o que devolve o token. */
  async confirmLogin(payload: ConfirmLoginPayload): Promise<LoginResponse> {
    const { data } = await httpClient.post<LoginResponse>(`${RESOURCE}/login/confirm`, payload);

    return data;
  },

  async resendLoginCode(challengeId: string): Promise<LoginChallenge> {
    const { data } = await httpClient.post<LoginChallenge>(`${RESOURCE}/login/resend`, {
      challengeId,
    });

    return data;
  },

  async me(): Promise<AuthenticatedUser> {
    const { data } = await httpClient.get<AuthenticatedUser>(`${RESOURCE}/me`);

    return data;
  },

  /** Vincula o CPF de quem opera a área restrita à conta da sessão. */
  async identify(cpf: string): Promise<AuthenticatedUser> {
    const { data } = await httpClient.put<AuthenticatedUser>(`${RESOURCE}/me/cpf`, { cpf });

    return data;
  },
};
