const BOOKING_TOKEN_KEY = 'condo-booking-token';

export function readBookingToken(slug: string): string | null {
  try {
    return sessionStorage.getItem(`${BOOKING_TOKEN_KEY}:${slug}`);
  } catch {
    return null;
  }
}

export function writeBookingToken(slug: string, token: string | null) {
  try {
    const key = `${BOOKING_TOKEN_KEY}:${slug}`;

    if (token) {
      sessionStorage.setItem(key, token);
    } else {
      sessionStorage.removeItem(key);
    }
  } catch {
    /* ignore */
  }
}
