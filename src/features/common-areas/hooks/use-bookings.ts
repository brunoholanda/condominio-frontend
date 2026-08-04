import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { bookingsApi } from '../api/bookings.api';
import type { BookingFilters, CreateBookingPayload } from '../model/common-area.types';

export const bookingKeys = {
  manager: (condominiumId: string, filters: BookingFilters) =>
    ['bookings', 'manager', condominiumId, filters] as const,
  mine: (slug: string) => ['bookings', 'mine', slug] as const,
};

export function useManagerBookingsQuery(condominiumId: string, filters: BookingFilters) {
  return useQuery({
    queryKey: bookingKeys.manager(condominiumId, filters),
    queryFn: () => bookingsApi.listForManager(condominiumId, filters),
    enabled: Boolean(condominiumId),
  });
}

function useInvalidateManagerBookings(condominiumId: string) {
  const queryClient = useQueryClient();

  return () =>
    queryClient.invalidateQueries({ queryKey: ['bookings', 'manager', condominiumId] });
}

export function useApproveBookingMutation(condominiumId: string) {
  const invalidate = useInvalidateManagerBookings(condominiumId);

  return useMutation({
    mutationFn: (bookingId: string) => bookingsApi.approve(condominiumId, bookingId),
    onSuccess: invalidate,
  });
}

export function useRejectBookingMutation(condominiumId: string) {
  const invalidate = useInvalidateManagerBookings(condominiumId);

  return useMutation({
    mutationFn: (bookingId: string) => bookingsApi.reject(condominiumId, bookingId),
    onSuccess: invalidate,
  });
}

export function useMyBookingsQuery(slug: string | undefined, enabled = true) {
  return useQuery({
    queryKey: bookingKeys.mine(slug ?? ''),
    queryFn: () => bookingsApi.listMine(slug as string),
    enabled: Boolean(slug) && enabled,
  });
}

function useInvalidateMyBookings(slug: string) {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries({ queryKey: bookingKeys.mine(slug) });
}

export function useCreateMyBookingMutation(slug: string) {
  const invalidate = useInvalidateMyBookings(slug);

  return useMutation({
    mutationFn: (payload: CreateBookingPayload) => bookingsApi.create(slug, payload),
    onSuccess: invalidate,
  });
}

export function useCancelMyBookingMutation(slug: string) {
  const invalidate = useInvalidateMyBookings(slug);

  return useMutation({
    mutationFn: (bookingId: string) => bookingsApi.cancelMine(slug, bookingId),
    onSuccess: invalidate,
  });
}
