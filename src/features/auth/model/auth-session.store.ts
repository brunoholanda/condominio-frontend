import type { AuthSession } from '../model/auth.types';

const STORAGE_KEY = 'condominio.auth.session';

/**
 * Persists the session in `localStorage` so a refresh does not kick the user
 * out. The storage is the only place that knows how the session is kept;
 * the rest of the app talks to `AuthSessionStore` through the context.
 */
export const authSessionStore = {
  read(): AuthSession | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);

      if (!raw) {
        return null;
      }

      const parsed = JSON.parse(raw) as Partial<AuthSession>;

      if (!parsed.accessToken || !parsed.user?.id || !parsed.user.email) {
        localStorage.removeItem(STORAGE_KEY);

        return null;
      }

      return parsed as AuthSession;
    } catch {
      localStorage.removeItem(STORAGE_KEY);

      return null;
    }
  },

  write(session: AuthSession): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  },

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  },
};
