import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { supportApi } from '../api/support.api';
import type {
  CreateTicketPayload,
  TicketCategory,
  TicketStatus,
  UpdateTicketStatusPayload,
} from '../model/support.types';

const keys = {
  all: ['support'] as const,
  mine: () => [...keys.all, 'mine'] as const,
  admin: (status?: TicketStatus, category?: TicketCategory) =>
    [...keys.all, 'admin', status ?? 'all', category ?? 'all'] as const,
};

export function useMyTicketsQuery(enabled = true) {
  return useQuery({
    queryKey: keys.mine(),
    queryFn: () => supportApi.listMine(),
    enabled,
  });
}

export function useCreateTicketMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTicketPayload) => supportApi.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: keys.mine() });
    },
  });
}

export function useAdminTicketsQuery(
  filters?: { status?: TicketStatus; category?: TicketCategory },
  enabled = true,
) {
  return useQuery({
    queryKey: keys.admin(filters?.status, filters?.category),
    queryFn: () => supportApi.listAll(filters),
    enabled,
  });
}

export function useUpdateTicketStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTicketStatusPayload }) =>
      supportApi.updateStatus(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: keys.all });
    },
  });
}
