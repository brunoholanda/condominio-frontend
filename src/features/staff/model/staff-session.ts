const STAFF_TOKEN_KEY = 'condo-staff-token';

export function readStaffToken(slug: string): string | null {
  try {
    return sessionStorage.getItem(`${STAFF_TOKEN_KEY}:${slug}`);
  } catch {
    return null;
  }
}

export function writeStaffToken(slug: string, token: string | null) {
  try {
    const key = `${STAFF_TOKEN_KEY}:${slug}`;

    if (token) {
      sessionStorage.setItem(key, token);
    } else {
      sessionStorage.removeItem(key);
    }
  } catch {
    /* ignore */
  }
}
