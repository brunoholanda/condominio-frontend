import { httpClient } from '@/shared/api/http-client';
import type {
  AuthenticatedUser,
  LoginPayload,
  LoginResponse,
} from '../model/auth.types';

const RESOURCE = '/auth';

export const authApi = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const { data } = await httpClient.post<LoginResponse>(`${RESOURCE}/login`, payload);

    return data;
  },

  async me(): Promise<AuthenticatedUser> {
    const { data } = await httpClient.get<AuthenticatedUser>(`${RESOURCE}/me`);

    return data;
  },
};
