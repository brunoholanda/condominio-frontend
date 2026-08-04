import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { notificationsApi } from '../api/notifications.api';

export const notificationKeys = {
  all: ['notifications'] as const,
  list: (condoId: string | undefined) => [...notificationKeys.all, 'list', condoId] as const,
  unread: (condoId: string | undefined) => [...notificationKeys.all, 'unread', condoId] as const,
};

export function useNotificationsQuery(condominiumId: string | undefined) {
  return useQuery({
    queryKey: notificationKeys.list(condominiumId),
    queryFn: () => notificationsApi.list(condominiumId),
    enabled: Boolean(condominiumId),
    refetchInterval: 60_000,
  });
}

export function useUnreadCountQuery(condominiumId: string | undefined) {
  return useQuery({
    queryKey: notificationKeys.unread(condominiumId),
    queryFn: () => notificationsApi.unreadCount(condominiumId),
    enabled: Boolean(condominiumId),
    refetchInterval: 30_000,
  });
}

export function useMarkNotificationReadMutation(_condominiumId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationsApi.markRead(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

export function useMarkAllNotificationsReadMutation(condominiumId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationsApi.markAllRead(condominiumId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}
