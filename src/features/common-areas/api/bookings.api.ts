import { httpClient } from '@/shared/api/http-client';
import type { Booking, BookingFilters, CreateBookingPayload } from '../model/common-area.types';
import { readBookingToken } from '../model/booking-session';

function bookingAuthHeaders(slug: string) {
  const token = readBookingToken(slug);

  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const bookingsApi = {
  /** Gestão: todas as reservas do condomínio, com filtros opcionais. */
  async listForManager(condominiumId: string, filters: BookingFilters): Promise<Booking[]> {
    const { data } = await httpClient.get<Booking[]>(`/condominiums/${condominiumId}/bookings`, {
      params: filters,
    });

    return data;
  },

  async approve(condominiumId: string, bookingId: string): Promise<Booking> {
    const { data } = await httpClient.post<Booking>(
      `/condominiums/${condominiumId}/bookings/${bookingId}/approve`,
    );

    return data;
  },

  async reject(condominiumId: string, bookingId: string): Promise<Booking> {
    const { data } = await httpClient.post<Booking>(
      `/condominiums/${condominiumId}/bookings/${bookingId}/reject`,
    );

    return data;
  },

  /** Morador: reservas com token de CPF + código. */
  async create(slug: string, payload: CreateBookingPayload): Promise<Booking> {
    const { data } = await httpClient.post<Booking>(`/c/${slug}/bookings`, payload, {
      headers: bookingAuthHeaders(slug),
    });

    return data;
  },

  async listMine(slug: string): Promise<Booking[]> {
    const { data } = await httpClient.get<Booking[]>(`/c/${slug}/bookings`, {
      headers: bookingAuthHeaders(slug),
    });

    return data;
  },

  async cancelMine(slug: string, bookingId: string): Promise<Booking> {
    const { data } = await httpClient.post<Booking>(
      `/c/${slug}/bookings/${bookingId}/cancel`,
      {},
      { headers: bookingAuthHeaders(slug) },
    );

    return data;
  },
};
