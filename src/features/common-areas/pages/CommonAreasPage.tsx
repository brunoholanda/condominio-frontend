import { App, Button, Popconfirm, Select, Skeleton, Table, Tabs, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { Check, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import { useManagerCondominium } from '@/features/condominiums/components/ManagerLayout';
import { ApiError } from '@/shared/api/api-error';
import { PageHeading } from '@/shared/components/PageHeading/PageHeading';
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { formatCentsToBRL } from '@/shared/utils/currency';
import { mobileTableProps } from '@/shared/utils/mobile-ui';
import { queries } from '@/styles/theme';
import { CommonAreaFormModal } from '../components/CommonAreaFormModal';
import { CreateResidentAccountForm } from '../components/CreateResidentAccountForm';
import {
  useApproveBookingMutation,
  useManagerBookingsQuery,
  useRejectBookingMutation,
} from '../hooks/use-bookings';
import {
  useCommonAreasQuery,
  useCreateCommonAreaMutation,
  useDeleteCommonAreaMutation,
  useUpdateCommonAreaMutation,
} from '../hooks/use-common-areas';
import { useResidentAccountsQuery } from '../hooks/use-resident-accounts';
import type {
  Booking,
  BookingStatus,
  CommonArea,
  CommonAreaPayload,
} from '../model/common-area.types';
import {
  BOOKING_STATUS_COLORS,
  BOOKING_STATUS_LABELS,
  BOOKING_STATUSES,
} from '../model/common-area.types';
import * as S from './CommonAreasPage.styles';

const DATE_FORMAT = 'DD/MM/YYYY HH:mm';

const STATUS_FILTER_OPTIONS = [
  { value: undefined, label: 'Todas as reservas' },
  ...BOOKING_STATUSES.map((status) => ({ value: status, label: BOOKING_STATUS_LABELS[status] })),
];

function AreasTab({ condominiumId }: { condominiumId: string }) {
  const { message, modal } = App.useApp();
  const isMobile = useMediaQuery(queries.downMd);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CommonArea | null>(null);

  const areasQuery = useCommonAreasQuery(condominiumId);
  const createArea = useCreateCommonAreaMutation(condominiumId);
  const updateArea = useUpdateCommonAreaMutation(condominiumId);
  const deleteArea = useDeleteCommonAreaMutation(condominiumId);

  const areas = areasQuery.data ?? [];

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (area: CommonArea) => {
    setEditing(area);
    setModalOpen(true);
  };

  const handleSubmit = (payload: CommonAreaPayload) => {
    const onSuccess = () => {
      message.success(editing ? 'Área atualizada.' : 'Área criada.');
      setModalOpen(false);
    };
    const onError = (error: unknown) =>
      message.error(error instanceof ApiError ? error.message : 'Não foi possível salvar a área.');

    if (editing) {
      updateArea.mutate({ areaId: editing.id, payload }, { onSuccess, onError });
    } else {
      createArea.mutate(payload, { onSuccess, onError });
    }
  };

  const handleDelete = (area: CommonArea) => {
    modal.confirm({
      title: `Remover "${area.name}"?`,
      okText: 'Remover',
      okButtonProps: { danger: true },
      cancelText: 'Cancelar',
      onOk: () =>
        deleteArea.mutate(area.id, {
          onSuccess: () => message.success('Área removida.'),
          onError: () => message.error('Não foi possível remover a área.'),
        }),
    });
  };

  const columns: ColumnsType<CommonArea> = [
    { title: 'Nome', dataIndex: 'name' },
    {
      title: 'Custo',
      dataIndex: 'costCents',
      width: 130,
      render: (cents: number) => (cents > 0 ? formatCentsToBRL(cents) : 'Gratuito'),
    },
    { title: 'Capacidade', dataIndex: 'capacity', width: 110 },
    {
      title: 'Aprovação',
      dataIndex: 'autoApprove',
      width: 130,
      render: (autoApprove: boolean) => (
        <Tag color={autoApprove ? 'green' : 'gold'}>{autoApprove ? 'Automática' : 'Manual'}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'active',
      width: 100,
      render: (active: boolean) => (
        <Tag color={active ? 'green' : 'default'}>{active ? 'Ativa' : 'Inativa'}</Tag>
      ),
    },
    {
      title: 'Ações',
      key: 'actions',
      width: 110,
      align: 'right',
      render: (_value, area) => (
        <>
          <Button type="text" size="small" icon={<Pencil size={15} />} onClick={() => openEdit(area)} />
          <Popconfirm
            title="Remover área"
            okText="Remover"
            cancelText="Cancelar"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(area)}
          >
            <Button type="text" size="small" danger icon={<Trash2 size={15} />} />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <S.Toolbar>
        <Button type="primary" icon={<Plus size={16} />} onClick={openCreate}>
          Nova área
        </Button>
      </S.Toolbar>

      {areasQuery.isLoading ? (
        <Skeleton active paragraph={{ rows: 5 }} />
      ) : isMobile ? (
        areas.length === 0 ? (
          <S.CardEmpty>Nenhuma área comum cadastrada.</S.CardEmpty>
        ) : (
          <S.CardList>
            {areas.map((area) => (
              <S.ItemCard key={area.id}>
                <S.CardTop>
                  <S.CardTitle>{area.name}</S.CardTitle>
                  <Tag color={area.active ? 'green' : 'default'}>
                    {area.active ? 'Ativa' : 'Inativa'}
                  </Tag>
                </S.CardTop>
                <S.CardMeta>
                  <span>{area.costCents > 0 ? formatCentsToBRL(area.costCents) : 'Gratuito'}</span>
                  <span>·</span>
                  <span>Capacidade {area.capacity}</span>
                </S.CardMeta>
                <S.CardTags>
                  <Tag color={area.autoApprove ? 'green' : 'gold'}>
                    {area.autoApprove ? 'Aprovação automática' : 'Aprovação manual'}
                  </Tag>
                </S.CardTags>
                <S.CardActions>
                  <Button icon={<Pencil size={16} />} onClick={() => openEdit(area)}>
                    Editar
                  </Button>
                  <Button danger icon={<Trash2 size={16} />} onClick={() => handleDelete(area)}>
                    Remover
                  </Button>
                </S.CardActions>
              </S.ItemCard>
            ))}
          </S.CardList>
        )
      ) : (
        <Table<CommonArea>
          rowKey="id"
          columns={columns}
          dataSource={areas}
          {...mobileTableProps(false)}
          pagination={false}
        />
      )}

      <CommonAreaFormModal
        open={modalOpen}
        area={editing}
        submitting={createArea.isPending || updateArea.isPending}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
}

function BookingsTab({ condominiumId }: { condominiumId: string }) {
  const { message } = App.useApp();
  const isMobile = useMediaQuery(queries.downMd);
  const [status, setStatus] = useState<BookingStatus | undefined>('REQUESTED');

  const areasQuery = useCommonAreasQuery(condominiumId);
  const bookingsQuery = useManagerBookingsQuery(condominiumId, { status });
  const approveBooking = useApproveBookingMutation(condominiumId);
  const rejectBooking = useRejectBookingMutation(condominiumId);

  const bookings = bookingsQuery.data ?? [];

  const areaNameById = useMemo(
    () => new Map((areasQuery.data ?? []).map((area) => [area.id, area.name])),
    [areasQuery.data],
  );

  const columns: ColumnsType<Booking> = [
    { title: 'Unidade', dataIndex: 'unitNumber', width: 110 },
    {
      title: 'Área',
      dataIndex: 'commonAreaId',
      render: (commonAreaId: string) => areaNameById.get(commonAreaId) ?? '—',
    },
    {
      title: 'Período',
      key: 'period',
      render: (_value, booking) =>
        `${dayjs(booking.startsAt).format(DATE_FORMAT)} – ${dayjs(booking.endsAt).format('HH:mm')}`,
    },
    {
      title: 'Custo',
      dataIndex: 'costSnapshotCents',
      width: 120,
      render: (cents: number) => (cents > 0 ? formatCentsToBRL(cents) : 'Gratuito'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 120,
      render: (bookingStatus: BookingStatus) => (
        <Tag color={BOOKING_STATUS_COLORS[bookingStatus]}>{BOOKING_STATUS_LABELS[bookingStatus]}</Tag>
      ),
    },
    {
      title: 'Ações',
      key: 'actions',
      width: 130,
      align: 'right',
      render: (_value, booking) =>
        booking.status === 'REQUESTED' ? (
          <>
            <Button
              type="text"
              size="small"
              icon={<Check size={15} />}
              onClick={() =>
                approveBooking.mutate(booking.id, {
                  onSuccess: () => message.success('Reserva aprovada.'),
                  onError: () => message.error('Não foi possível aprovar a reserva.'),
                })
              }
            />
            <Button
              type="text"
              size="small"
              danger
              icon={<X size={15} />}
              onClick={() =>
                rejectBooking.mutate(booking.id, {
                  onSuccess: () => message.success('Reserva recusada.'),
                  onError: () => message.error('Não foi possível recusar a reserva.'),
                })
              }
            />
          </>
        ) : null,
    },
  ];

  return (
    <>
      <S.Toolbar>
        <Select<BookingStatus | undefined>
          value={status}
          style={{ width: isMobile ? '100%' : 220 }}
          options={STATUS_FILTER_OPTIONS}
          onChange={setStatus}
        />
      </S.Toolbar>

      {bookingsQuery.isLoading ? (
        <Skeleton active paragraph={{ rows: 5 }} />
      ) : isMobile ? (
        bookings.length === 0 ? (
          <S.CardEmpty>Nenhuma reserva encontrada.</S.CardEmpty>
        ) : (
          <S.CardList>
            {bookings.map((booking) => (
              <S.ItemCard key={booking.id}>
                <S.CardTop>
                  <S.CardTitle>Unidade {booking.unitNumber}</S.CardTitle>
                  <Tag color={BOOKING_STATUS_COLORS[booking.status]}>
                    {BOOKING_STATUS_LABELS[booking.status]}
                  </Tag>
                </S.CardTop>
                <S.CardMeta>
                  <span>{areaNameById.get(booking.commonAreaId) ?? 'Área'}</span>
                </S.CardMeta>
                <S.CardMeta>
                  <span>
                    {dayjs(booking.startsAt).format(DATE_FORMAT)} –{' '}
                    {dayjs(booking.endsAt).format('HH:mm')}
                  </span>
                  <span>·</span>
                  <span>
                    {booking.costSnapshotCents > 0
                      ? formatCentsToBRL(booking.costSnapshotCents)
                      : 'Gratuito'}
                  </span>
                </S.CardMeta>
                {booking.status === 'REQUESTED' ? (
                  <S.CardActions>
                    <Button
                      type="primary"
                      icon={<Check size={16} />}
                      loading={approveBooking.isPending}
                      onClick={() =>
                        approveBooking.mutate(booking.id, {
                          onSuccess: () => message.success('Reserva aprovada.'),
                          onError: () => message.error('Não foi possível aprovar a reserva.'),
                        })
                      }
                    >
                      Aprovar
                    </Button>
                    <Button
                      danger
                      icon={<X size={16} />}
                      loading={rejectBooking.isPending}
                      onClick={() =>
                        rejectBooking.mutate(booking.id, {
                          onSuccess: () => message.success('Reserva recusada.'),
                          onError: () => message.error('Não foi possível recusar a reserva.'),
                        })
                      }
                    >
                      Recusar
                    </Button>
                  </S.CardActions>
                ) : null}
              </S.ItemCard>
            ))}
          </S.CardList>
        )
      ) : (
        <Table<Booking>
          rowKey="id"
          columns={columns}
          dataSource={bookings}
          {...mobileTableProps(false)}
          pagination={false}
        />
      )}
    </>
  );
}

function ResidentAccountsTab({ condominiumId, units }: { condominiumId: string; units: string[] }) {
  const isMobile = useMediaQuery(queries.downMd);
  const accountsQuery = useResidentAccountsQuery(condominiumId);
  const accounts = accountsQuery.data ?? [];

  const columns: ColumnsType<{ id: string; unitNumber: string; createdAt: string }> = [
    { title: 'Unidade', dataIndex: 'unitNumber', width: 130 },
    {
      title: 'Vinculada em',
      dataIndex: 'createdAt',
      render: (createdAt: string) => dayjs(createdAt).format('DD/MM/YYYY'),
    },
  ];

  return (
    <>
      <S.AccountsIntro>
        Vincule a conta de um morador (já cadastrada em <strong>/registro</strong>) a uma unidade
        para que ele possa reservar áreas comuns em <code>/c/{'{slug}'}/reservas</code>.
      </S.AccountsIntro>

      <CreateResidentAccountForm condominiumId={condominiumId} units={units} />

      {accountsQuery.isLoading ? (
        <Skeleton active paragraph={{ rows: 4 }} style={{ marginTop: 24 }} />
      ) : isMobile ? (
        accounts.length === 0 ? (
          <S.CardEmpty>Nenhuma conta vinculada.</S.CardEmpty>
        ) : (
          <S.CardList style={{ marginTop: 24 }}>
            {accounts.map((account) => (
              <S.ItemCard key={account.id}>
                <S.CardTitle>Unidade {account.unitNumber}</S.CardTitle>
                <S.CardMeta>
                  Vinculada em {dayjs(account.createdAt).format('DD/MM/YYYY')}
                </S.CardMeta>
              </S.ItemCard>
            ))}
          </S.CardList>
        )
      ) : (
        <Table
          style={{ marginTop: 24 }}
          rowKey="id"
          columns={columns}
          dataSource={accounts}
          {...mobileTableProps(false)}
          pagination={false}
        />
      )}
    </>
  );
}

export function CommonAreasPage() {
  const condominium = useManagerCondominium();

  return (
    <>
      <PageHeading
        title="Áreas comuns"
        description="Cadastre as áreas disponíveis, aprove reservas e vincule contas de moradores às unidades."
      />

      <Tabs
        defaultActiveKey="areas"
        items={[
          {
            key: 'areas',
            label: 'Áreas',
            children: <AreasTab condominiumId={condominium.id} />,
          },
          {
            key: 'bookings',
            label: 'Reservas',
            children: <BookingsTab condominiumId={condominium.id} />,
          },
          {
            key: 'accounts',
            label: 'Contas de moradores',
            children: (
              <ResidentAccountsTab condominiumId={condominium.id} units={condominium.unitNumbers} />
            ),
          },
        ]}
      />
    </>
  );
}
