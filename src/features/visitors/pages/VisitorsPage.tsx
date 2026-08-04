import {
  App,
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Table,
  Tag,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { type Dayjs } from 'dayjs';
import { LogIn, UserPlus, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import { useManagerCondominium } from '@/features/condominiums/components/ManagerLayout';
import { buildUnitOptions } from '@/features/residents/model/condo';
import { ApiError } from '@/shared/api/api-error';
import { PageHeading } from '@/shared/components/PageHeading/PageHeading';
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { rules } from '@/shared/utils/form-rules';
import { mobileOverlayWidth } from '@/shared/utils/mobile-ui';
import { queries } from '@/styles/theme';
import {
  useCancelVisitorMutation,
  useCheckInVisitorMutation,
  useCreateVisitorMutation,
  useVisitorsQuery,
} from '../hooks/use-visitors';
import type { VisitorPass, VisitorPassStatus } from '../model/visitor.types';
import {
  VISITOR_PASS_STATUS_COLORS,
  VISITOR_PASS_STATUS_LABELS,
  VISITOR_PASS_STATUSES,
} from '../model/visitor.types';
import * as S from './VisitorsPage.styles';

interface CreateFormValues {
  visitorName: string;
  visitorDocument?: string;
  hostName: string;
  unitNumber?: string;
  expectedAt: Dayjs;
  expiresAt: Dayjs;
  notes?: string;
}

export function VisitorsPage() {
  const condominium = useManagerCondominium();
  const { message } = App.useApp();
  const isMobile = useMediaQuery(queries.downMd);
  const canCancel = condominium.myRole === 'OWNER' || condominium.myRole === 'MANAGER';
  const [status, setStatus] = useState<VisitorPassStatus | undefined>('PENDING');
  const [createOpen, setCreateOpen] = useState(false);
  const [form] = Form.useForm<CreateFormValues>();

  const filters = useMemo(() => ({ status }), [status]);
  const visitorsQuery = useVisitorsQuery(condominium.id, filters);
  const createVisitor = useCreateVisitorMutation(condominium.id);
  const checkIn = useCheckInVisitorMutation(condominium.id);
  const cancelPass = useCancelVisitorMutation(condominium.id);

  const unitOptions = useMemo(
    () => buildUnitOptions(condominium.unitNumbers),
    [condominium.unitNumbers],
  );

  const openCreate = () => {
    form.resetFields();
    form.setFieldsValue({
      expectedAt: dayjs().add(15, 'minute'),
      expiresAt: dayjs().add(4, 'hour'),
    });
    setCreateOpen(true);
  };

  const handleCreate = (values: CreateFormValues) => {
    createVisitor.mutate(
      {
        visitorName: values.visitorName.trim(),
        visitorDocument: values.visitorDocument?.trim() || null,
        hostName: values.hostName.trim(),
        unitNumber: values.unitNumber || null,
        expectedAt: values.expectedAt.toISOString(),
        expiresAt: values.expiresAt.toISOString(),
        notes: values.notes?.trim() || null,
      },
      {
        onSuccess: () => {
          message.success('Passe de visitante registrado.');
          setCreateOpen(false);
        },
        onError: (error: unknown) =>
          message.error(
            error instanceof ApiError ? error.message : 'Não foi possível registrar o visitante.',
          ),
      },
    );
  };

  const columns: ColumnsType<VisitorPass> = [
    {
      title: 'Visitante',
      dataIndex: 'visitorName',
      ellipsis: true,
    },
    {
      title: 'Documento',
      dataIndex: 'visitorDocument',
      width: 120,
      responsive: ['md'],
      render: (value: string | null) => value ?? '—',
    },
    {
      title: 'Anfitrião',
      dataIndex: 'hostName',
      ellipsis: true,
    },
    {
      title: 'Unidade',
      dataIndex: 'unitNumber',
      width: 90,
      render: (value: string | null) => value ?? '—',
    },
    {
      title: 'Previsto',
      dataIndex: 'expectedAt',
      width: 140,
      render: (value: string) => dayjs(value).format('DD/MM HH:mm'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 120,
      render: (value: VisitorPassStatus) => (
        <Tag color={VISITOR_PASS_STATUS_COLORS[value]}>{VISITOR_PASS_STATUS_LABELS[value]}</Tag>
      ),
    },
    {
      title: 'Ações',
      key: 'actions',
      width: 200,
      fixed: 'right',
      render: (_value, row) => (
        <S.Actions>
          {row.status === 'PENDING' ? (
            <Button
              size="small"
              type="primary"
              icon={<LogIn size={14} />}
              loading={checkIn.isPending}
              onClick={() =>
                checkIn.mutate(row.id, {
                  onSuccess: () => message.success('Entrada registrada.'),
                  onError: (error: unknown) =>
                    message.error(
                      error instanceof ApiError
                        ? error.message
                        : 'Não foi possível registrar a entrada.',
                    ),
                })
              }
            >
              Check-in
            </Button>
          ) : null}
          {row.status === 'PENDING' && canCancel ? (
            <Popconfirm
              title="Cancelar este passe?"
              okText="Cancelar passe"
              cancelText="Voltar"
              onConfirm={() =>
                cancelPass.mutate(row.id, {
                  onSuccess: () => message.success('Passe cancelado.'),
                  onError: (error: unknown) =>
                    message.error(
                      error instanceof ApiError
                        ? error.message
                        : 'Não foi possível cancelar o passe.',
                    ),
                })
              }
            >
              <Button size="small" danger icon={<X size={14} />}>
                Cancelar
              </Button>
            </Popconfirm>
          ) : null}
        </S.Actions>
      ),
    },
  ];

  return (
    <>
      <PageHeading
        title="Visitantes"
        description="Registre passes de visita e confirme a entrada na portaria."
        actions={
          <Button type="primary" icon={<UserPlus size={16} />} onClick={openCreate}>
            Novo visitante
          </Button>
        }
      />

      <S.Filters>
        <Select
          allowClear
          placeholder="Status"
          style={{ width: isMobile ? '100%' : 200 }}
          value={status}
          options={VISITOR_PASS_STATUSES.map((value) => ({
            value,
            label: VISITOR_PASS_STATUS_LABELS[value],
          }))}
          onChange={(value) => setStatus(value)}
        />
      </S.Filters>

      <S.Card>
        <Table
          rowKey="id"
          loading={visitorsQuery.isLoading}
          columns={columns}
          dataSource={visitorsQuery.data ?? []}
          pagination={{ pageSize: 20 }}
          scroll={{ x: 900 }}
          locale={{ emptyText: 'Nenhum passe de visitante encontrado.' }}
        />
      </S.Card>

      <Modal
        title="Novo visitante"
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        footer={null}
        destroyOnHidden
        width={mobileOverlayWidth(isMobile, 520)}
      >
        <Form<CreateFormValues>
          form={form}
          layout="vertical"
          requiredMark={false}
          onFinish={handleCreate}
          disabled={createVisitor.isPending}
        >
          <Form.Item name="visitorName" label="Nome do visitante" rules={[rules.required()]}>
            <Input placeholder="Nome completo" />
          </Form.Item>
          <Form.Item name="visitorDocument" label="Documento">
            <Input placeholder="RG ou CPF (opcional)" />
          </Form.Item>
          <Form.Item name="hostName" label="Anfitrião" rules={[rules.required()]}>
            <Input placeholder="Quem recebe" />
          </Form.Item>
          <Form.Item name="unitNumber" label="Unidade">
            <Select
              allowClear
              showSearch
              options={unitOptions}
              optionFilterProp="label"
              placeholder="Opcional"
            />
          </Form.Item>
          <Form.Item name="expectedAt" label="Chegada prevista" rules={[rules.required()]}>
            <DatePicker showTime format="DD/MM/YYYY HH:mm" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="expiresAt" label="Válido até" rules={[rules.required()]}>
            <DatePicker showTime format="DD/MM/YYYY HH:mm" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="notes" label="Observações">
            <Input.TextArea rows={2} maxLength={1000} />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={createVisitor.isPending}>
            Registrar passe
          </Button>
        </Form>
      </Modal>
    </>
  );
}
