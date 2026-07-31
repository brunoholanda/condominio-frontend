import axios from 'axios';

import { authSessionStore } from '@/features/auth/model/auth-session.store';
import { toApiError } from './api-error';

const DEFAULT_BASE_URL = 'http://localhost:3333/api';

type UnauthorizedHandler = () => void;

let onUnauthorized: UnauthorizedHandler | null = null;

/** Lets the AuthProvider clear the session when the API rejects the token. */
export function setUnauthorizedHandler(handler: UnauthorizedHandler | null): void {
  onUnauthorized = handler;
}

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? DEFAULT_BASE_URL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

httpClient.interceptors.request.use((config) => {
  const token = authSessionStore.read()?.accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const apiError = toApiError(error);
    const requestUrl = axios.isAxiosError(error) ? (error.config?.url ?? '') : '';

    // A failed login must not wipe a session that might already exist.
    if (apiError.status === 401 && !requestUrl.includes('/auth/login')) {
      onUnauthorized?.();
    }

    return Promise.reject(apiError);
  },
);
