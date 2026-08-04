export const NOTIFICATION_CATEGORIES = [
  'CHARGE',
  'VISITOR',
  'WORK_ORDER',
  'ABSENCE',
  'SYSTEM',
] as const;

export type NotificationCategory = (typeof NOTIFICATION_CATEGORIES)[number];

export const NOTIFICATION_CATEGORY_LABELS: Record<NotificationCategory, string> = {
  CHARGE: 'Cobrança',
  VISITOR: 'Visitante',
  WORK_ORDER: 'Chamado',
  ABSENCE: 'Falta',
  SYSTEM: 'Sistema',
};

export interface AppNotification {
  id: string;
  condominiumId: string;
  userId: string | null;
  title: string;
  body: string;
  category: NotificationCategory;
  linkPath: string | null;
  readAt: string | null;
  createdAt: string;
}

export interface UnreadCount {
  count: number;
}

export interface MarkAllReadResult {
  updated: number;
}
