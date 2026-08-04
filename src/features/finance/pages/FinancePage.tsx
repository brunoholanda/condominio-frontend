import { App, Button, Input, Select, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { Eye, Pencil, Plus, Search } from 'lucide-react';
import { useState } from 'react';

import { useManagerCondominium } from '@/features/condominiums/components/ManagerLayout';
import { ApiError } from '@/shared/api/api-error';
import { PageHeading } from '@/shared/components/PageHeading/PageHeading';
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { formatCentsToBRL } from '@/shared/utils/currency';
import { mobileTableProps } from '@/shared/utils/mobile-ui';
import { queries } from '@/styles/theme';
import { PayableDetailsDrawer } from '../components/PayableDetailsDrawer';
import { PayableFormDrawer } from '../components/PayableFormDrawer';
import { useCreatePayableMutation, usePayablesQuery, useUpdatePayableMutation } from '../hooks/use-finance';
import type { Payable, PayableFilters, PayablePayload, PayableStatus } from '../model/finance.types';
import { PAYABLE_STATUS_COLORS, PAYABLE_STATUS_LABELS, PAYABLE_STATUSES } from '../model/finance.types';

const INITIAL_FILTERS: PayableFilters = { page: 1, limit: 10 };

const STATUS_OPTIONS = PAYABLE_STATUSES.map((value) => ({
  value,
  label: PAYABLE_STATUS_LABELS[value],
}));

const DATE_FORMAT = 'DD/MM/YYYY';

export function FinancePage() {
  const condominium = useManagerCondominium();
  const { message } = App.useApp();
  const isMobile = useMediaQuery(queries.downMd);
  const [filters, setFilters] = useState<PayableFilters>(INITIAL_FILTERS);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Payable | null>(null);
  const [detailsPayable, setDetailsPayable] = useState<Payable | null>(null);

  const payablesQuery = usePayablesQuery(condominium.id, filters);
  const createPayable = useCreatePayableMutation(condominium.id);
  const updatePayable = useUpdatePayableMutation(condominium.id);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (payable: Payable) => {
    setEditing(payable);
    setFormOpen(true);
  };

  const handleSubmit = (payload: PayablePayload) => {
    const onSuccess = () => {
      message.success(editing ? 'Conta atualizada.' : 'Conta criada.');
      setFormOpen(false);
    };
    const onError = (error: unknown) =>
      message.error(error instanceof ApiError ? error.message : 'Não foi possível salvar a conta.');

    if (editing) {
      updatePayable.mutate({ id: editing.id, payload }, { onSuccess, onError });
    } else {
      createPayable.mutate(payload, { onSuccess, onError });
    }
  };

  const columns: ColumnsType<Payable> = [
    { title: 'Descrição', dataIndex: 'description', ellipsis: true },
    { title: 'Fornecedor', dataIndex: 'vendor', responsive: ['md'] },
    { title: 'Categoria', dataIndex: 'category', width: 130, responsive: ['lg'] },
    {
      title: 'Valor',
      dataIndex: 'amountCents',
      width: 130,
      render: (cents: number) => formatCentsToBRL(cents),
    },
    {
      title: 'Vencimento',
      dataIndex: 'dueDate',
      width: 120,
      render: (dueDate: string) => dayjs(dueDate).format(DATE_FORMAT),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 120,
      render: (status: PayableStatus) => (
        <Tag color={PAYABLE_STATUS_COLORS[status]}>{PAYABLE_STATUS_LABELS[status]}</Tag>
      ),
    },
    {
      title: 'Ações',
      key: 'actions',
      width: isMobile ? 96 : 160,
      align: 'right',
      render: (_value, payable) => (
        <Space size={4}>
          <Button
            size="small"
            type={isMobile ? 'text' : 'default'}
            icon={isMobile ? <Eye size={15} /> : undefined}
            aria-label="Detalhes"
            onClick={() => setDetailsPayable(payable)}
          >
            {isMobile ? null : 'Detalhes'}
          </Button>
          {payable.status === 'PENDING' ? (
            <Button
              size="small"
              type={isMobile ? 'text' : 'default'}
              icon={isMobile ? <Pencil size={15} /> : undefined}
              aria-label="Editar"
              onClick={() => openEdit(payable)}
            >
              {isMobile ? null : 'Editar'}
            </Button>
          ) : null}
        </Space>
      ),
    },
  ];

  return (
    <>
      <PageHeading
        title="Financeiro"
        description="Contas a pagar do condomínio: crie, acompanhe o vencimento, marque como paga e anexe comprovantes."
        actions={
          <Button type="primary" icon={<Plus size={16} />} onClick={openCreate}>
            Nova conta
          </Button>
        }
      />

      <Space wrap style={{ marginBottom: 16, width: '100%' }} styles={{ item: { flex: isMobile ? '1 1 100%' : undefined } }}>
        <Input
          allowClear
          prefix={<Search size={15} />}
          placeholder="Buscar por descrição ou fornecedor"
          style={{ width: isMobile ? '100%' : 280 }}
          onChange={(event) =>
            setFilters((current) => ({ ...current, page: 1, search: event.target.value || undefined }))
          }
        />
        <Select
          allowClear
          placeholder="Status"
          options={STATUS_OPTIONS}
          style={{ width: isMobile ? '100%' : 160 }}
          onChange={(status?: PayableStatus) => setFilters((current) => ({ ...current, page: 1, status }))}
        />
      </Space>

      <Table<Payable>
        rowKey="id"
        columns={columns}
        dataSource={payablesQuery.data?.items ?? []}
        loading={payablesQuery.isFetching}
        {...mobileTableProps(isMobile, {
          current: filters.page,
          pageSize: filters.limit,
          total: payablesQuery.data?.total ?? 0,
          showTotal: isMobile ? undefined : (count) => `${count} conta(s)`,
          onChange: (page, limit) => setFilters((current) => ({ ...current, page, limit })),
        })}
      />

      <PayableFormDrawer
        open={formOpen}
        payable={editing}
        submitting={createPayable.isPending || updatePayable.isPending}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />

      <PayableDetailsDrawer
        condominiumId={condominium.id}
        payable={detailsPayable}
        open={Boolean(detailsPayable)}
        onClose={() => setDetailsPayable(null)}
      />
    </>
  );
}
