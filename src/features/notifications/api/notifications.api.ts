import { httpClient } from '@/shared/api/http-client';

import type {
  AppNotification,
  MarkAllReadResult,
  UnreadCount,
} from '../model/notification.types';

export const notificationsApi = {
  async list(condominiumId?: string): Promise<AppNotification[]> {
    const { data } = await httpClient.get<AppNotification[]>('/notifications', {
      params: condominiumId ? { condominiumId } : undefined,
    });

    return data;
  },

  async unreadCount(condominiumId?: string): Promise<UnreadCount> {
    const { data } = await httpClient.get<UnreadCount>('/notifications/unread-count', {
      params: condominiumId ? { condominiumId } : undefined,
    });

    return data;
  },

  async markRead(id: string): Promise<AppNotification> {
    const { data } = await httpClient.patch<AppNotification>(`/notifications/${id}/read`);

    return data;
  },

  async markAllRead(condominiumId?: string): Promise<MarkAllReadResult> {
    const { data } = await httpClient.post<MarkAllReadResult>('/notifications/read-all', null, {
      params: condominiumId ? { condominiumId } : undefined,
    });

    return data;
  },
};
