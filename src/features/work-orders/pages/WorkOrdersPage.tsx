import {
  App,
  Button,
  Form,
  Input,
  Modal,
  Select,
  Table,
  Tag,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { ClipboardPlus } from 'lucide-react';
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
  useCreateWorkOrderMutation,
  useUpdateWorkOrderStatusMutation,
  useWorkOrdersQuery,
} from '../hooks/use-work-orders';
import type {
  WorkOrder,
  WorkOrderCategory,
  WorkOrderPriority,
  WorkOrderStatus,
} from '../model/work-order.types';
import {
  WORK_ORDER_CATEGORIES,
  WORK_ORDER_CATEGORY_LABELS,
  WORK_ORDER_PRIORITIES,
  WORK_ORDER_PRIORITY_COLORS,
  WORK_ORDER_PRIORITY_LABELS,
  WORK_ORDER_STATUS_LABELS,
  WORK_ORDER_STATUSES,
} from '../model/work-order.types';
import * as S from './WorkOrdersPage.styles';

interface CreateFormValues {
  title: string;
  description: string;
  category: WorkOrderCategory;
  priority?: WorkOrderPriority;
  unitNumber?: string;
  reporterName?: string;
  assignedTo?: string;
}

export function WorkOrdersPage() {
  const condominium = useManagerCondominium();
  const { message } = App.useApp();
  const isMobile = useMediaQuery(queries.downMd);
  const [status, setStatus] = useState<WorkOrderStatus | undefined>();
  const [category, setCategory] = useState<WorkOrderCategory | undefined>();
  const [createOpen, setCreateOpen] = useState(false);
  const [form] = Form.useForm<CreateFormValues>();

  const filters = useMemo(() => ({ status, category }), [status, category]);
  const ordersQuery = useWorkOrdersQuery(condominium.id, filters);
  const createOrder = useCreateWorkOrderMutation(condominium.id);
  const updateStatus = useUpdateWorkOrderStatusMutation(condominium.id);

  const unitOptions = useMemo(
    () => buildUnitOptions(condominium.unitNumbers),
    [condominium.unitNumbers],
  );

  const openCreate = () => {
    form.resetFields();
    form.setFieldsValue({ priority: 'NORMAL' });
    setCreateOpen(true);
  };

  const handleCreate = (values: CreateFormValues) => {
    createOrder.mutate(
      {
        title: values.title.trim(),
        description: values.description.trim(),
        category: values.category,
        priority: values.priority,
        unitNumber: values.unitNumber || null,
        reporterName: values.reporterName?.trim() || null,
        assignedTo: values.assignedTo?.trim() || null,
      },
      {
        onSuccess: () => {
          message.success('Chamado aberto.');
          setCreateOpen(false);
        },
        onError: (error: unknown) =>
          message.error(
            error instanceof ApiError ? error.message : 'Não foi possível abrir o chamado.',
          ),
      },
    );
  };

  const handleStatusChange = (orderId: string, nextStatus: WorkOrderStatus) => {
    updateStatus.mutate(
      { orderId, payload: { status: nextStatus } },
      {
        onSuccess: () => message.success('Status atualizado.'),
        onError: (error: unknown) =>
          message.error(
            error instanceof ApiError ? error.message : 'Não foi possível atualizar o status.',
          ),
      },
    );
  };

  const columns: ColumnsType<WorkOrder> = [
    {
      title: 'Título',
      dataIndex: 'title',
      ellipsis: true,
    },
    {
      title: 'Categoria',
      dataIndex: 'category',
      width: 120,
      render: (value: WorkOrderCategory) => WORK_ORDER_CATEGORY_LABELS[value],
    },
    {
      title: 'Prioridade',
      dataIndex: 'priority',
      width: 110,
      render: (value: WorkOrderPriority) => (
        <Tag color={WORK_ORDER_PRIORITY_COLORS[value]}>{WORK_ORDER_PRIORITY_LABELS[value]}</Tag>
      ),
    },
    {
      title: 'Unidade',
      dataIndex: 'unitNumber',
      width: 90,
      render: (value: string | null) => value ?? '—',
    },
    {
      title: 'Aberto em',
      dataIndex: 'createdAt',
      width: 130,
      render: (value: string) => dayjs(value).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 170,
      render: (value: WorkOrderStatus, row) => (
        <Select
          size="small"
          value={value}
          style={{ width: 150 }}
          options={WORK_ORDER_STATUSES.map((s) => ({
            value: s,
            label: WORK_ORDER_STATUS_LABELS[s],
          }))}
          onChange={(next) => handleStatusChange(row.id, next)}
          disabled={updateStatus.isPending}
        />
      ),
    },
  ];

  return (
    <>
      <PageHeading
        title="Chamados"
        description="Abra e acompanhe solicitações de manutenção, limpeza, segurança e outros."
        actions={
          <Button type="primary" icon={<ClipboardPlus size={16} />} onClick={openCreate}>
            Novo chamado
          </Button>
        }
      />

      <S.Filters>
        <Select
          allowClear
          placeholder="Status"
          style={{ width: isMobile ? '100%' : 180 }}
          value={status}
          options={WORK_ORDER_STATUSES.map((value) => ({
            value,
            label: WORK_ORDER_STATUS_LABELS[value],
          }))}
          onChange={setStatus}
        />
        <Select
          allowClear
          placeholder="Categoria"
          style={{ width: isMobile ? '100%' : 180 }}
          value={category}
          options={WORK_ORDER_CATEGORIES.map((value) => ({
            value,
            label: WORK_ORDER_CATEGORY_LABELS[value],
          }))}
          onChange={setCategory}
        />
      </S.Filters>

      <S.Card>
        <Table
          rowKey="id"
          loading={ordersQuery.isLoading}
          columns={columns}
          dataSource={ordersQuery.data ?? []}
          pagination={{ pageSize: 20 }}
          scroll={{ x: 960 }}
          locale={{ emptyText: 'Nenhum chamado encontrado.' }}
        />
      </S.Card>

      <Modal
        title="Novo chamado"
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        footer={null}
        destroyOnHidden
        width={mobileOverlayWidth(isMobile, 560)}
      >
        <Form<CreateFormValues>
          form={form}
          layout="vertical"
          requiredMark={false}
          onFinish={handleCreate}
          disabled={createOrder.isPending}
        >
          <Form.Item name="title" label="Título" rules={[rules.required(), rules.text(3, 200)]}>
            <Input placeholder="Resumo do problema" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Descrição"
            rules={[rules.required(), rules.text(5, 5000)]}
          >
            <Input.TextArea rows={4} placeholder="Detalhe o que precisa ser resolvido" />
          </Form.Item>
          <Form.Item name="category" label="Categoria" rules={[rules.required()]}>
            <Select
              options={WORK_ORDER_CATEGORIES.map((value) => ({
                value,
                label: WORK_ORDER_CATEGORY_LABELS[value],
              }))}
            />
          </Form.Item>
          <Form.Item name="priority" label="Prioridade">
            <Select
              options={WORK_ORDER_PRIORITIES.map((value) => ({
                value,
                label: WORK_ORDER_PRIORITY_LABELS[value],
              }))}
            />
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
          <Form.Item name="reporterName" label="Solicitante">
            <Input placeholder="Nome de quem reportou (opcional)" />
          </Form.Item>
          <Form.Item name="assignedTo" label="Responsável">
            <Input placeholder="Quem vai atender (opcional)" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={createOrder.isPending}>
            Abrir chamado
          </Button>
        </Form>
      </Modal>
    </>
  );
}
