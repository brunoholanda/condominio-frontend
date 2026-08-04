import { App, Badge, Button, Dropdown, Spin } from 'antd';
import dayjs from 'dayjs';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { ApiError } from '@/shared/api/api-error';
import {
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
  useNotificationsQuery,
  useUnreadCountQuery,
} from '../hooks/use-notifications';
import type { AppNotification } from '../model/notification.types';
import { NOTIFICATION_CATEGORY_LABELS } from '../model/notification.types';
import * as S from './NotificationBell.styles';

interface NotificationBellProps {
  condominiumId: string;
}

export function NotificationBell({ condominiumId }: NotificationBellProps) {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const listQuery = useNotificationsQuery(condominiumId);
  const unreadQuery = useUnreadCountQuery(condominiumId);
  const markRead = useMarkNotificationReadMutation(condominiumId);
  const markAllRead = useMarkAllNotificationsReadMutation(condominiumId);

  const unread = unreadQuery.data?.count ?? 0;
  const items = listQuery.data ?? [];

  const handleItemClick = (item: AppNotification) => {
    if (!item.readAt) {
      markRead.mutate(item.id, {
        onError: (error: unknown) =>
          message.error(
            error instanceof ApiError ? error.message : 'Não foi possível marcar como lida.',
          ),
      });
    }

    if (item.linkPath) {
      void navigate(item.linkPath);
    }
  };

  const handleMarkAll = () => {
    markAllRead.mutate(undefined, {
      onSuccess: () => message.success('Notificações marcadas como lidas.'),
      onError: (error: unknown) =>
        message.error(
          error instanceof ApiError ? error.message : 'Não foi possível marcar todas como lidas.',
        ),
    });
  };

  const dropdownContent = (
    <S.Panel>
      <S.PanelHeader>
        <S.PanelTitle>Notificações</S.PanelTitle>
        {unread > 0 ? (
          <Button type="link" size="small" onClick={handleMarkAll} loading={markAllRead.isPending}>
            Marcar todas
          </Button>
        ) : null}
      </S.PanelHeader>

      {listQuery.isLoading ? (
        <div style={{ padding: 24, textAlign: 'center' }}>
          <Spin size="small" />
        </div>
      ) : items.length === 0 ? (
        <S.Empty>Nenhuma notificação.</S.Empty>
      ) : (
        <S.List>
          {items.map((item) => (
            <S.Item
              key={item.id}
              $unread={!item.readAt}
              onClick={() => handleItemClick(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  handleItemClick(item);
                }
              }}
            >
              <S.ItemTitle>{item.title}</S.ItemTitle>
              <S.ItemBody>{item.body}</S.ItemBody>
              <S.ItemMeta>
                {NOTIFICATION_CATEGORY_LABELS[item.category]} ·{' '}
                {dayjs(item.createdAt).format('DD/MM HH:mm')}
              </S.ItemMeta>
            </S.Item>
          ))}
        </S.List>
      )}
    </S.Panel>
  );

  return (
    <Dropdown
      trigger={['click']}
      placement="bottomRight"
      popupRender={() => dropdownContent}
    >
      <S.Trigger type="button" aria-label="Notificações">
        <Badge count={unread} size="small" offset={[-2, 2]} color="#e8b86d">
          <Bell size={18} aria-hidden />
        </Badge>
      </S.Trigger>
    </Dropdown>
  );
}
