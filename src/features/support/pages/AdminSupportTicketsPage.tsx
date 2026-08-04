import { App, Button, Select, Skeleton, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Shield } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { ApiError } from '@/shared/api/api-error';
import { PageHeading } from '@/shared/components/PageHeading/PageHeading';
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { mobileTableProps } from '@/shared/utils/mobile-ui';
import { queries } from '@/styles/theme';
import { useAdminTicketsQuery, useUpdateTicketStatusMutation } from '../hooks/use-support';
import type { SupportTicket, TicketCategory, TicketStatus } from '../model/support.types';
import {
  TICKET_CATEGORIES,
  TICKET_CATEGORY_LABELS,
  TICKET_STATUS_COLORS,
  TICKET_STATUS_LABELS,
  TICKET_STATUSES,
} from '../model/support.types';
import * as S from './SupportPages.styles';

/** Fila de chamados para o dono do sistema. */
export function AdminSupportTicketsPage() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const isMobile = useMediaQuery(queries.downMd);
  const isSystemOwner = Boolean(session?.user.isSystemOwner);
  const [status, setStatus] = useState<TicketStatus | undefined>();
  const [category, setCategory] = useState<TicketCategory | undefined>();
  const ticketsQuery = useAdminTicketsQuery({ status, category }, isSystemOwner);
  const updateStatus = useUpdateTicketStatusMutation();

  const openCount = useMemo(
    () =>
      (ticketsQuery.data ?? []).filter(
        (ticket) => ticket.status === 'OPEN' || ticket.status === 'IN_PROGRESS',
      ).length,
    [ticketsQuery.data],
  );

  if (!isSystemOwner) {
    return <Navigate to="/app" replace />;
  }

  const columns: ColumnsType<SupportTicket> = [
    {
      title: 'Status',
      dataIndex: 'status',
      width: isMobile ? 140 : 160,
      render: (value: TicketStatus, ticket) => (
        <Select
          size="small"
          value={value}
          style={{ minWidth: isMobile ? 120 : 140 }}
          options={TICKET_STATUSES.map((item) => ({
            value: item,
            label: TICKET_STATUS_LABELS[item],
          }))}
          disabled={updateStatus.isPending}
          onChange={(next) => {
            updateStatus.mutate(
              { id: ticket.id, payload: { status: next } },
              {
                onSuccess: () => message.success('Status atualizado.'),
                onError: (error: unknown) =>
                  message.error(
                    error instanceof ApiError
                      ? error.message
                      : 'Não foi possível atualizar o status.',
                  ),
              },
            );
          }}
        />
      ),
    },
    {
      title: 'Tipo',
      dataIndex: 'category',
      width: 120,
      responsive: ['md'],
      render: (value: SupportTicket['category']) => (
        <Tag>{TICKET_CATEGORY_LABELS[value]}</Tag>
      ),
    },
    {
      title: 'Assunto',
      dataIndex: 'subject',
      ellipsis: true,
    },
    {
      title: 'Autor',
      key: 'author',
      width: 220,
      responsive: ['lg'],
      render: (_value, ticket) => (
        <span>
          {ticket.authorName}
          <br />
          <small>{ticket.authorEmail}</small>
        </span>
      ),
    },
    {
      title: 'Aberto em',
      dataIndex: 'createdAt',
      width: 150,
      responsive: ['md'],
      render: (createdAt: string) =>
        new Date(createdAt).toLocaleString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
    },
  ];

  return (
    <S.Page>
      <PageHeading
        title="Chamados"
        description="Fila de problemas e melhorias enviados pelos usuários da plataforma."
        actions={
          <Button icon={<Shield size={16} />} onClick={() => void navigate('/app/admin/contas')}>
            Contas
          </Button>
        }
      />

      <S.Intro>
        <S.IntroIcon aria-hidden>
          <Shield size={22} />
        </S.IntroIcon>
        <S.IntroText>
          <S.IntroTitle>
            {ticketsQuery.isLoading
              ? 'Carregando fila…'
              : openCount > 0
                ? `${openCount} chamado(s) pedem atenção`
                : 'Nenhum chamado pendente no filtro atual'}
          </S.IntroTitle>
          <S.IntroDesc>
            Expanda a linha para ler o detalhe completo e atualize o status conforme o andamento.
          </S.IntroDesc>
        </S.IntroText>
      </S.Intro>

      <S.AdminFilters>
        <Select
          allowClear
          placeholder="Filtrar por status"
          style={{ width: isMobile ? '100%' : 220 }}
          value={status}
          onChange={(value) => setStatus(value)}
          options={TICKET_STATUSES.map((item) => ({
            value: item,
            label: TICKET_STATUS_LABELS[item],
          }))}
        />
        <Select
          allowClear
          placeholder="Filtrar por tipo"
          style={{ width: isMobile ? '100%' : 220 }}
          value={category}
          onChange={(value) => setCategory(value)}
          options={TICKET_CATEGORIES.map((item) => ({
            value: item,
            label: TICKET_CATEGORY_LABELS[item],
          }))}
        />
      </S.AdminFilters>

      {ticketsQuery.isLoading ? <Skeleton active paragraph={{ rows: 6 }} /> : null}

      {!ticketsQuery.isLoading ? (
        <Table
          rowKey="id"
          columns={columns}
          dataSource={ticketsQuery.data ?? []}
          {...mobileTableProps(isMobile, { pageSize: 20 })}
          expandable={{
            expandedRowRender: (ticket) => (
              <S.ExpandBody>
                <Tag color={TICKET_STATUS_COLORS[ticket.status]}>
                  {TICKET_STATUS_LABELS[ticket.status]}
                </Tag>
                <p style={{ marginTop: 12, marginBottom: 0 }}>{ticket.body}</p>
              </S.ExpandBody>
            ),
          }}
          locale={{ emptyText: 'Nenhum chamado encontrado com esses filtros.' }}
        />
      ) : null}
    </S.Page>
  );
}
