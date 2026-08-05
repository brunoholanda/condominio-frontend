import {
  Alert,
  App,
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  Modal,
  Skeleton,
  Table,
  Tag,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { type Dayjs } from 'dayjs';
import { CalendarPlus, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { usePublicCondominiumQuery } from '@/features/condominiums/hooks/use-condominiums';
import { ApiError } from '@/shared/api/api-error';
import { PageHeading } from '@/shared/components/PageHeading/PageHeading';
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { formatCentsToBRL } from '@/shared/utils/currency';
import { rules } from '@/shared/utils/form-rules';
import { maskCpf, onlyDigits } from '@/shared/utils/masks';
import { mobileOverlayWidth, mobileTableProps } from '@/shared/utils/mobile-ui';
import { queries } from '@/styles/theme';
import { bookingAuthApi, type BookingAuthMe } from '../api/booking-auth.api';
import { usePublicCommonAreasQuery } from '../hooks/use-common-areas';
import {
  useCancelMyBookingMutation,
  useCreateMyBookingMutation,
  useMyBookingsQuery,
} from '../hooks/use-bookings';
import { readBookingToken, writeBookingToken } from '../model/booking-session';
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

type AuthStep = 'cpf' | 'code';

export function ResidentBookingsPage() {
  const { slug } = useParams<{ slug: string }>();
  const { message } = App.useApp();
  const isMobile = useMediaQuery(queries.downMd);
  const condoQuery = usePublicCondominiumQuery(slug);
  const [form] = Form.useForm<BookingFormValues>();
  const [cpfForm] = Form.useForm<{ cpf: string }>();
  const [codeForm] = Form.useForm<{ code: string }>();
  const [bookingArea, setBookingArea] = useState<CommonArea | null>(null);

  const [token, setToken] = useState<string | null>(() => (slug ? readBookingToken(slug) : null));
  const [me, setMe] = useState<BookingAuthMe | null>(null);
  const [loadingMe, setLoadingMe] = useState(false);
  const [authStep, setAuthStep] = useState<AuthStep>('cpf');
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [emailHint, setEmailHint] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  const authenticated = Boolean(token && me);
  const areasQuery = usePublicCommonAreasQuery(slug);
  const bookingsQuery = useMyBookingsQuery(slug, authenticated);
  const createBooking = useCreateMyBookingMutation(slug ?? '');
  const cancelBooking = useCancelMyBookingMutation(slug ?? '');

  useEffect(() => {
    if (!slug || !token) {
      setMe(null);

      return;
    }

    let cancelled = false;
    setLoadingMe(true);

    void bookingAuthApi
      .me(slug, token)
      .then((profile) => {
        if (!cancelled) {
          setMe(profile);
        }
      })
      .catch(() => {
        if (!cancelled) {
          writeBookingToken(slug, null);
          setToken(null);
          setMe(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingMe(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [slug, token]);

  const logout = () => {
    if (slug) {
      writeBookingToken(slug, null);
    }

    setToken(null);
    setMe(null);
    setAuthStep('cpf');
    setChallengeId(null);
    setEmailHint(null);
    cpfForm.resetFields();
    codeForm.resetFields();
  };

  const handleStart = async (values: { cpf: string }) => {
    if (!slug) {
      return;
    }

    setAuthLoading(true);

    try {
      const result = await bookingAuthApi.start(slug, onlyDigits(values.cpf));
      setChallengeId(result.challengeId);
      setEmailHint(result.emailHint);
      setAuthStep('code');
      message.success(`Código enviado para ${result.emailHint}`);
    } catch (error: unknown) {
      message.error(
        error instanceof ApiError
          ? error.message
          : 'Não foi possível enviar o código. Verifique o CPF.',
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const handleConfirm = async (values: { code: string }) => {
    if (!slug || !challengeId) {
      return;
    }

    setAuthLoading(true);

    try {
      const result = await bookingAuthApi.confirm(slug, challengeId, values.code.trim());
      writeBookingToken(slug, result.accessToken);
      setToken(result.accessToken);
      // `me` carrega no effect; perfil parcial evita flash vazio.
      setMe({
        residentId: '',
        fullName: result.fullName,
        unitNumber: result.unitNumber,
        emailHint: result.emailHint,
        condominiumName: condoQuery.data?.name ?? '',
      });
      message.success(`Olá, ${result.fullName.split(' ')[0]}!`);
    } catch (error: unknown) {
      message.error(error instanceof ApiError ? error.message : 'Código inválido.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleResend = async () => {
    if (!slug || !challengeId) {
      return;
    }

    setAuthLoading(true);

    try {
      const result = await bookingAuthApi.resend(slug, challengeId);
      setChallengeId(result.challengeId);
      setEmailHint(result.emailHint);
      message.success(`Novo código enviado para ${result.emailHint}`);
    } catch (error: unknown) {
      message.error(error instanceof ApiError ? error.message : 'Não foi possível reenviar.');
    } finally {
      setAuthLoading(false);
    }
  };

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

  if (!slug) {
    return null;
  }

  if (loadingMe && token) {
    return <Skeleton active paragraph={{ rows: 6 }} />;
  }

  if (!authenticated) {
    return (
      <>
        <PageHeading
          title="Reservar áreas comuns"
          description={
            condoQuery.data
              ? `Acesso para moradores cadastrados em ${condoQuery.data.name}. Informe o CPF do titular.`
              : 'Acesso para moradores cadastrados. Informe o CPF do titular.'
          }
        />

        {authStep === 'cpf' ? (
          <Form form={cpfForm} layout="vertical" requiredMark={false} onFinish={handleStart}>
            <Form.Item
              name="cpf"
              label="CPF do titular da unidade"
              normalize={maskCpf}
              rules={[rules.required('Informe o CPF'), rules.cpf()]}
              extra="Enviaremos um código ao e-mail cadastrado no formulário de morador (parcialmente oculto)."
            >
              <Input placeholder="000.000.000-00" inputMode="numeric" autoComplete="off" />
            </Form.Item>
            <Button type="primary" htmlType="submit" block loading={authLoading}>
              Enviar código
            </Button>
          </Form>
        ) : (
          <Form form={codeForm} layout="vertical" requiredMark={false} onFinish={handleConfirm}>
            <Alert
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
              message={`Enviamos um código para ${emailHint ?? 'o e-mail cadastrado'}`}
              description="Só quem tem acesso a essa caixa de entrada consegue concluir. Se o endereço não for o seu, volte e confira o CPF."
            />
            <Form.Item
              name="code"
              label="Código de 6 dígitos"
              rules={[
                rules.required('Informe o código'),
                { pattern: /^\d{6}$/, message: 'Código com 6 dígitos' },
              ]}
            >
              <Input placeholder="000000" inputMode="numeric" autoComplete="one-time-code" maxLength={6} />
            </Form.Item>
            <Button type="primary" htmlType="submit" block loading={authLoading}>
              Confirmar e continuar
            </Button>
            <Button type="link" block disabled={authLoading} onClick={() => void handleResend()}>
              Reenviar código
            </Button>
            <Button
              type="link"
              block
              disabled={authLoading}
              onClick={() => {
                setAuthStep('cpf');
                setChallengeId(null);
                setEmailHint(null);
              }}
            >
              Usar outro CPF
            </Button>
          </Form>
        )}
      </>
    );
  }

  return (
    <>
      <PageHeading
        title="Reservar áreas comuns"
        description={`${me?.fullName} · unidade ${me?.unitNumber}`}
        actions={
          <Button icon={<LogOut size={16} />} onClick={logout}>
            Sair
          </Button>
        }
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
            <Button type="primary" icon={<CalendarPlus size={16} />} onClick={() => openBookingForm(area)}>
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
