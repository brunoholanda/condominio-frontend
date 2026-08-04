import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { ApiError } from '@/shared/api/api-error';
import { setUnauthorizedHandler } from '@/shared/api/http-client';
import { authApi } from '../api/auth.api';
import { authSessionStore } from '../model/auth-session.store';
import type {
  AuthenticatedUser,
  AuthSession,
  LoginChallenge,
  LoginPayload,
} from '../model/auth.types';

interface AuthContextValue {
  session: AuthSession | null;
  isAuthenticated: boolean;
  /** True while the stored token is being revalidated against the API. */
  isBootstrapping: boolean;
  /** Primeira etapa: não abre sessão, apenas dispara o código por e-mail. */
  login: (payload: LoginPayload) => Promise<LoginChallenge>;
  /** Segunda etapa: o código confere e a sessão finalmente é criada. */
  confirmLogin: (challengeId: string, code: string) => Promise<void>;
  resendLoginCode: (challengeId: string) => Promise<LoginChallenge>;
  /** Registra o CPF de responsabilidade do operador e atualiza a sessão. */
  identify: (cpf: string) => Promise<void>;
  /** Recarrega o usuário autenticado (ex.: após webhook Stripe). */
  refreshSession: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const restored = useMemo(() => authSessionStore.read(), []);
  const [accessToken, setAccessToken] = useState<string | null>(restored?.accessToken ?? null);
  const [user, setUser] = useState<AuthenticatedUser | null>(restored?.user ?? null);
  const [isBootstrapping, setIsBootstrapping] = useState(Boolean(restored));

  const logout = useCallback(() => {
    authSessionStore.clear();
    setAccessToken(null);
    setUser(null);
  }, []);

  const login = useCallback((payload: LoginPayload) => authApi.login(payload), []);

  const resendLoginCode = useCallback(
    (challengeId: string) => authApi.resendLoginCode(challengeId),
    [],
  );

  const confirmLogin = useCallback(async (challengeId: string, code: string) => {
    const response = await authApi.confirmLogin({ challengeId, code });

    authSessionStore.write({ accessToken: response.accessToken, user: response.user });
    setAccessToken(response.accessToken);
    setUser(response.user);
  }, []);

  const identify = useCallback(
    async (cpf: string) => {
      const identified = await authApi.identify(cpf);

      if (accessToken) {
        authSessionStore.write({ accessToken, user: identified });
      }

      setUser(identified);
    },
    [accessToken],
  );

  const refreshSession = useCallback(async () => {
    if (!accessToken) {
      return;
    }

    const freshUser = await authApi.me();
    authSessionStore.write({ accessToken, user: freshUser });
    setUser(freshUser);
  }, [accessToken]);

  useEffect(() => {
    setUnauthorizedHandler(logout);

    return () => setUnauthorizedHandler(null);
  }, [logout]);

  // Confirms with the API that a restored token is still valid before trusting it.
  useEffect(() => {
    if (!accessToken) {
      setIsBootstrapping(false);

      return;
    }

    let cancelled = false;

    void authApi
      .me()
      .then((freshUser) => {
        if (cancelled) {
          return;
        }

        authSessionStore.write({ accessToken, user: freshUser });
        setUser(freshUser);
      })
      .catch((error: unknown) => {
        // Only drop the session when the server itself rejected the token.
        if (!cancelled && error instanceof ApiError && error.status === 401) {
          logout();
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsBootstrapping(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [accessToken, logout]);

  const value = useMemo<AuthContextValue>(() => {
    const session = accessToken && user ? { accessToken, user } : null;

    return {
      session,
      isAuthenticated: session !== null,
      isBootstrapping,
      login,
      confirmLogin,
      resendLoginCode,
      identify,
      refreshSession,
      logout,
    };
  }, [
    accessToken,
    confirmLogin,
    identify,
    isBootstrapping,
    login,
    logout,
    refreshSession,
    resendLoginCode,
    user,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  }

  return context;
}
