import { httpClient } from '@/shared/api/http-client';
import type { Booking, BookingFilters, CreateBookingPayload } from '../model/common-area.types';

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

  /** Morador: reservas na área do condomínio identificado pelo slug. */
  async create(slug: string, payload: CreateBookingPayload): Promise<Booking> {
    const { data } = await httpClient.post<Booking>(`/c/${slug}/bookings`, payload);

    return data;
  },

  async listMine(slug: string): Promise<Booking[]> {
    const { data } = await httpClient.get<Booking[]>(`/c/${slug}/bookings`);

    return data;
  },

  async cancelMine(slug: string, bookingId: string): Promise<Booking> {
    const { data } = await httpClient.post<Booking>(`/c/${slug}/bookings/${bookingId}/cancel`);

    return data;
  },
};
