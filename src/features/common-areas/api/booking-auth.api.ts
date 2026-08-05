import { httpClient } from '@/shared/api/http-client';

export interface BookingAuthStartResult {
  challengeId: string;
  emailHint: string;
  expiresInSeconds: number;
}

export interface BookingAuthConfirmResult {
  accessToken: string;
  expiresInSeconds: number;
  fullName: string;
  unitNumber: string;
  emailHint: string;
}

export interface BookingAuthMe {
  residentId: string;
  fullName: string;
  unitNumber: string;
  emailHint: string;
  condominiumName: string;
}

export const bookingAuthApi = {
  async start(slug: string, cpf: string): Promise<BookingAuthStartResult> {
    const { data } = await httpClient.post<BookingAuthStartResult>(
      `/c/${slug}/booking-auth/start`,
      { cpf },
    );

    return data;
  },

  async confirm(
    slug: string,
    challengeId: string,
    code: string,
  ): Promise<BookingAuthConfirmResult> {
    const { data } = await httpClient.post<BookingAuthConfirmResult>(
      `/c/${slug}/booking-auth/confirm`,
      { challengeId, code },
    );

    return data;
  },

  async resend(slug: string, challengeId: string): Promise<BookingAuthStartResult> {
    const { data } = await httpClient.post<BookingAuthStartResult>(
      `/c/${slug}/booking-auth/resend`,
      { challengeId },
    );

    return data;
  },

  async me(slug: string, accessToken: string): Promise<BookingAuthMe> {
    const { data } = await httpClient.get<BookingAuthMe>(`/c/${slug}/booking-auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return data;
  },
};
