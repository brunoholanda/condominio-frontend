import { App, Button, Checkbox, DatePicker, Form, Input, Modal, Result, Skeleton, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { type Dayjs } from 'dayjs';
import { CalendarPlus } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { ApiError } from '@/shared/api/api-error';
import { PageHeading } from '@/shared/components/PageHeading/PageHeading';
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { formatCentsToBRL } from '@/shared/utils/currency';
import { rules } from '@/shared/utils/form-rules';
import { mobileOverlayWidth, mobileTableProps } from '@/shared/utils/mobile-ui';
import { queries } from '@/styles/theme';
import { usePublicCommonAreasQuery } from '../hooks/use-common-areas';
import { useCancelMyBookingMutation, useCreateMyBookingMutation, useMyBookingsQuery } from '../hooks/use-bookings';
import type { Booking, BookingStatus, CommonArea } from '../model/common-area.types';
import { BOOKING_STATUS_COLORS, BOOKING_STATUS_LABELS } from '../model/common-area.types';
import * as S from './ResidentBookingsPage.styles';

const { RangePicker } = DatePicker;
const DATE_FORMAT = 'DD/MM/YYYY HH:mm';

interface BookingFormValues {
  range: [Dayjs, Dayjs];
  notes?: string;
  acceptRules: boolean;
}

export function ResidentBookingsPage() {
  const { slug } = useParams<{ slug: string }>();
  const { message } = App.useApp();
  const isMobile = useMediaQuery(queries.downMd);
  const [form] = Form.useForm<BookingFormValues>();
  const [bookingArea, setBookingArea] = useState<CommonArea | null>(null);

  const areasQuery = usePublicCommonAreasQuery(slug);
  const bookingsQuery = useMyBookingsQuery(slug);
  const createBooking = useCreateMyBookingMutation(slug ?? '');
  const cancelBooking = useCancelMyBookingMutation(slug ?? '');

  if (bookingsQuery.isError) {
    const errorMessage =
      bookingsQuery.error instanceof ApiError
        ? bookingsQuery.error.message
        : 'Não foi possível abrir suas reservas.';

    return (
      <Result
        status="403"
        title="Reservas indisponíveis"
        subTitle={errorMessage}
      />
    );
  }

  const openBookingForm = (area: CommonArea) => {
    setBookingArea(area);
    form.resetFields();
  };

  const handleSubmit = (values: BookingFormValues) => {
    if (!bookingArea) {
      return;
    }

    createBooking.mutate(
      {
        commonAreaId: bookingArea.id,
        startsAt: values.range[0].toISOString(),
        endsAt: values.range[1].toISOString(),
        acceptRules: values.acceptRules,
        notes: values.notes?.trim() || null,
      },
      {
        onSuccess: (booking) => {
          message.success(
            booking.status === 'APPROVED'
              ? 'Reserva confirmada!'
              : 'Reserva solicitada. Aguarde a aprovação da administração.',
          );
          setBookingArea(null);
        },
        onError: (error: unknown) =>
          message.error(error instanceof ApiError ? error.message : 'Não foi possível reservar.'),
      },
    );
  };

  const handleCancel = (booking: Booking) => {
    cancelBooking.mutate(booking.id, {
      onSuccess: () => message.success('Reserva cancelada.'),
      onError: (error: unknown) =>
        message.error(error instanceof ApiError ? error.message : 'Não foi possível cancelar.'),
    });
  };

  const columns: ColumnsType<Booking> = [
    {
      title: 'Área',
      dataIndex: 'commonAreaId',
      render: (commonAreaId: string) =>
        (areasQuery.data ?? []).find((area) => area.id === commonAreaId)?.name ?? '—',
    },
    {
      title: 'Período',
      key: 'period',
      render: (_value, booking) =>
        `${dayjs(booking.startsAt).format(DATE_FORMAT)} – ${dayjs(booking.endsAt).format('HH:mm')}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status: BookingStatus) => (
        <Tag color={BOOKING_STATUS_COLORS[status]}>{BOOKING_STATUS_LABELS[status]}</Tag>
      ),
    },
    {
      title: 'Ações',
      key: 'actions',
      align: 'right',
      render: (_value, booking) =>
        booking.status === 'REQUESTED' || booking.status === 'APPROVED' ? (
          <Button size="small" danger loading={cancelBooking.isPending} onClick={() => handleCancel(booking)}>
            Cancelar
          </Button>
        ) : null,
    },
  ];

  return (
    <>
      <PageHeading
        title="Reservar áreas comuns"
        description="Escolha uma área, confira as regras e envie sua solicitação de reserva."
      />

      {areasQuery.isLoading ? <Skeleton active paragraph={{ rows: 4 }} /> : null}

      <S.Grid>
        {(areasQuery.data ?? []).map((area) => (
          <S.AreaCard key={area.id}>
            <S.AreaName>{area.name}</S.AreaName>
            {area.description ? <S.AreaMeta>{area.description}</S.AreaMeta> : null}
            <S.AreaMeta>
              {area.costCents > 0 ? formatCentsToBRL(area.costCents) : 'Reserva gratuita'} · até{' '}
              {area.capacity} pessoas
            </S.AreaMeta>
            <Button
              type="primary"
              icon={<CalendarPlus size={16} />}
              onClick={() => openBookingForm(area)}
            >
              Reservar
            </Button>
          </S.AreaCard>
        ))}
      </S.Grid>

      <PageHeading title="Minhas reservas" />

      <Table<Booking>
        rowKey="id"
        columns={columns}
        dataSource={bookingsQuery.data ?? []}
        loading={bookingsQuery.isLoading}
        {...mobileTableProps(isMobile)}
        pagination={false}
      />

      <Modal
        open={Boolean(bookingArea)}
        title={bookingArea ? `Reservar: ${bookingArea.name}` : ''}
        onCancel={() => setBookingArea(null)}
        onOk={() => form.submit()}
        okText="Solicitar reserva"
        cancelText="Cancelar"
        confirmLoading={createBooking.isPending}
        width={mobileOverlayWidth(isMobile, 520)}
      >
        {bookingArea?.rules ? <S.RulesText>{bookingArea.rules}</S.RulesText> : null}

        <Form form={form} layout="vertical" requiredMark={false} onFinish={handleSubmit}>
          <Form.Item
            name="range"
            label="Data e horário"
            rules={[rules.required('Selecione o início e o fim da reserva')]}
          >
            <RangePicker showTime format="DD/MM/YYYY HH:mm" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="notes" label="Observações (opcional)">
            <Input.TextArea rows={3} placeholder="Ex.: Aniversário de 10 anos." />
          </Form.Item>

          <Form.Item
            name="acceptRules"
            valuePropName="checked"
            rules={[rules.accepted('É necessário aceitar as regras da área para reservar')]}
          >
            <Checkbox>Li e aceito as regras de uso desta área</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
