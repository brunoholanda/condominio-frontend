import {
  App,
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Upload,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { type Dayjs } from 'dayjs';
import { Check, ClipboardList, Paperclip, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import { useManagerCondominium } from '@/features/condominiums/components/ManagerLayout';
import { ApiError } from '@/shared/api/api-error';
import { PageHeading } from '@/shared/components/PageHeading/PageHeading';
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { rules } from '@/shared/utils/form-rules';
import { mobileOverlayWidth } from '@/shared/utils/mobile-ui';
import { queries } from '@/styles/theme';
import {
  useAbsencesQuery,
  useCreateAbsenceMutation,
  useDeleteAbsenceMutation,
  useEmployeesQuery,
  useReviewAbsenceMutation,
  useUpdateAbsenceMutation,
  useUploadAbsenceAttachmentMutation,
} from '../hooks/use-staff';
import {
  ABSENCE_REASON_LABELS,
  ABSENCE_REASONS,
  ABSENCE_STATUS_COLORS,
  ABSENCE_STATUS_LABELS,
  ABSENCE_STATUSES,
  type AbsenceReason,
  type AbsenceStatus,
  type EmployeeAbsence,
} from '../model/staff.types';
import * as S from './AbsencesAdminPage.styles';

interface FormValues {
  employeeId: string;
  reason: AbsenceReason;
  period: [Dayjs, Dayjs];
  notes?: string;
}

const REASON_OPTIONS = ABSENCE_REASONS.map((value) => ({
  value,
  label: ABSENCE_REASON_LABELS[value],
}));

export function AbsencesAdminPage() {
  const condominium = useManagerCondominium();
  const { message } = App.useApp();
  const isMobile = useMediaQuery(queries.downMd);
  const [month, setMonth] = useState<Dayjs>(dayjs().startOf('month'));
  const [employeeId, setEmployeeId] = useState<string | undefined>();
  const [reason, setReason] = useState<AbsenceReason | undefined>();
  const [statusFilter, setStatusFilter] = useState<AbsenceStatus | undefined>();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<EmployeeAbsence | null>(null);
  const [form] = Form.useForm<FormValues>();

  const employeesQuery = useEmployeesQuery(condominium.id);
  const filters = useMemo(
    () => ({
      from: month.startOf('month').format('YYYY-MM-DD'),
      to: month.endOf('month').format('YYYY-MM-DD'),
      employeeId,
      reason,
      status: statusFilter,
    }),
    [month, employeeId, reason, statusFilter],
  );
  const absencesQuery = useAbsencesQuery(condominium.id, filters);
  const createAbsence = useCreateAbsenceMutation(condominium.id);
  const updateAbsence = useUpdateAbsenceMutation(condominium.id);
  const deleteAbsence = useDeleteAbsenceMutation(condominium.id);
  const reviewAbsence = useReviewAbsenceMutation(condominium.id);
  const uploadAttachment = useUploadAbsenceAttachmentMutation(condominium.id);
  const saving = createAbsence.isPending || updateAbsence.isPending;

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({
      period: [dayjs(), dayjs()],
    });
    setModalOpen(true);
  };

  const openEdit = (absence: EmployeeAbsence) => {
    setEditing(absence);
    form.setFieldsValue({
      employeeId: absence.employeeId,
      reason: absence.reason,
      period: [dayjs(absence.startDate), dayjs(absence.endDate)],
      notes: absence.notes ?? undefined,
    });
    setModalOpen(true);
  };

  const handleSubmit = (values: FormValues) => {
    const payload = {
      employeeId: values.employeeId,
      reason: values.reason,
      startDate: values.period[0].format('YYYY-MM-DD'),
      endDate: values.period[1].format('YYYY-MM-DD'),
      notes: values.notes?.trim() || null,
    };

    if (editing) {
      updateAbsence.mutate(
        { absenceId: editing.id, payload },
        {
          onSuccess: () => {
            message.success('Justificativa atualizada.');
            setModalOpen(false);
          },
          onError: (error: unknown) =>
            message.error(error instanceof ApiError ? error.message : 'Não foi possível salvar.'),
        },
      );
      return;
    }

    createAbsence.mutate(payload, {
      onSuccess: () => {
        message.success('Justificativa registrada.');
        setModalOpen(false);
      },
      onError: (error: unknown) =>
        message.error(error instanceof ApiError ? error.message : 'Não foi possível salvar.'),
    });
  };

  const handleReview = (absenceId: string, status: 'APPROVED' | 'REJECTED') => {
    reviewAbsence.mutate(
      { absenceId, payload: { status } },
      {
        onSuccess: () =>
          message.success(status === 'APPROVED' ? 'Justificativa aprovada.' : 'Justificativa rejeitada.'),
        onError: (error: unknown) =>
          message.error(
            error instanceof ApiError ? error.message : 'Não foi possível revisar a justificativa.',
          ),
      },
    );
  };

  const columns: ColumnsType<EmployeeAbsence> = [
    {
      title: 'Período',
      key: 'period',
      render: (_, row) => {
        const start = dayjs(row.startDate).format('DD/MM/YYYY');
        const end = dayjs(row.endDate).format('DD/MM/YYYY');

        return start === end ? start : `${start} — ${end}`;
      },
    },
    {
      title: 'Funcionário',
      dataIndex: 'employeeName',
      render: (name: string | undefined) => name ?? '—',
    },
    {
      title: 'Motivo',
      dataIndex: 'reason',
      render: (value: AbsenceReason, row) => (
        <Tag color={value === 'FALTA_INJUSTIFICADA' ? 'red' : 'blue'}>
          {row.reasonLabel || ABSENCE_REASON_LABELS[value]}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 120,
      render: (value: AbsenceStatus) => (
        <Tag color={ABSENCE_STATUS_COLORS[value]}>{ABSENCE_STATUS_LABELS[value]}</Tag>
      ),
    },
    {
      title: 'Anexo',
      key: 'attachment',
      width: 100,
      render: (_, row) =>
        row.hasAttachment ? (
          <Tag color="cyan">Anexado</Tag>
        ) : (
          <Upload
            showUploadList={false}
            beforeUpload={(file) => {
              uploadAttachment.mutate(
                { absenceId: row.id, file },
                {
                  onSuccess: () => message.success('Anexo enviado.'),
                  onError: (error: unknown) =>
                    message.error(
                      error instanceof ApiError ? error.message : 'Falha ao enviar anexo.',
                    ),
                },
              );
              return false;
            }}
          >
            <Button
              type="text"
              size="small"
              icon={<Paperclip size={14} />}
              loading={uploadAttachment.isPending}
              aria-label="Anexar arquivo"
            />
          </Upload>
        ),
    },
    {
      title: 'Observações',
      dataIndex: 'notes',
      ellipsis: true,
      render: (notes: string | null) => notes ?? '—',
    },
    {
      title: '',
      key: 'actions',
      width: 180,
      render: (_, row) => (
        <Space wrap>
          {row.status === 'PENDING' ? (
            <>
              <Button
                type="text"
                icon={<Check size={16} />}
                aria-label="Aprovar"
                title="Aprovar"
                loading={reviewAbsence.isPending}
                onClick={() => handleReview(row.id, 'APPROVED')}
              />
              <Button
                type="text"
                danger
                icon={<X size={16} />}
                aria-label="Rejeitar"
                title="Rejeitar"
                loading={reviewAbsence.isPending}
                onClick={() => handleReview(row.id, 'REJECTED')}
              />
            </>
          ) : null}
          <Button
            type="text"
            icon={<Pencil size={16} />}
            aria-label="Editar"
            onClick={() => openEdit(row)}
          />
          <Popconfirm
            title="Remover esta justificativa?"
            okText="Remover"
            cancelText="Cancelar"
            onConfirm={() =>
              deleteAbsence.mutate(row.id, {
                onSuccess: () => message.success('Justificativa removida.'),
                onError: (error: unknown) =>
                  message.error(
                    error instanceof ApiError ? error.message : 'Não foi possível remover.',
                  ),
              })
            }
          >
            <Button type="text" danger icon={<Trash2 size={16} />} aria-label="Remover" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <PageHeading
        title="Faltas e justificativas"
        description="Registre ausências com os motivos habituais de RH (atestado, férias, licença etc.)."
        actions={
          <Button type="primary" icon={<Plus size={16} />} onClick={openCreate}>
            Justificar falta
          </Button>
        }
      />

      <S.Filters>
        <DatePicker
          picker="month"
          value={month}
          onChange={(value) => value && setMonth(value.startOf('month'))}
          format="MM/YYYY"
        />
        <Select
          allowClear
          placeholder="Funcionário"
          style={{ minWidth: 220 }}
          value={employeeId}
          onChange={setEmployeeId}
          options={(employeesQuery.data ?? []).map((e) => ({
            value: e.id,
            label: e.fullName,
          }))}
        />
        <Select
          allowClear
          placeholder="Motivo"
          style={{ minWidth: 260 }}
          value={reason}
          onChange={setReason}
          options={REASON_OPTIONS}
          showSearch
          optionFilterProp="label"
        />
        <Select
          allowClear
          placeholder="Status"
          style={{ minWidth: 140 }}
          value={statusFilter}
          onChange={setStatusFilter}
          options={ABSENCE_STATUSES.map((value) => ({
            value,
            label: ABSENCE_STATUS_LABELS[value],
          }))}
        />
      </S.Filters>

      <S.Card>
        <Table
          rowKey="id"
          loading={absencesQuery.isLoading}
          columns={columns}
          dataSource={absencesQuery.data ?? []}
          pagination={{ pageSize: 20 }}
          scroll={{ x: 1000 }}
          locale={{
            emptyText: (
              <S.EmptyHint>
                <ClipboardList size={28} aria-hidden />
                <span>Nenhuma justificativa neste período.</span>
              </S.EmptyHint>
            ),
          }}
        />
      </S.Card>

      <Modal
        title={editing ? 'Editar justificativa' : 'Justificar falta'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText="Salvar"
        cancelText="Cancelar"
        confirmLoading={saving}
        width={mobileOverlayWidth(isMobile, 560)}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" requiredMark={false} onFinish={handleSubmit}>
          <Form.Item name="employeeId" label="Funcionário" rules={[rules.required()]}>
            <Select
              showSearch
              optionFilterProp="label"
              placeholder="Selecione o funcionário"
              options={(employeesQuery.data ?? [])
                .filter((e) => e.isActive || e.id === editing?.employeeId)
                .map((e) => ({ value: e.id, label: e.fullName }))}
            />
          </Form.Item>

          <Form.Item name="reason" label="Motivo" rules={[rules.required()]}>
            <Select
              showSearch
              optionFilterProp="label"
              placeholder="Selecione a justificativa"
              options={REASON_OPTIONS}
            />
          </Form.Item>

          <Form.Item
            name="period"
            label="Período da ausência"
            rules={[rules.required('Informe o período')]}
          >
            <DatePicker.RangePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="notes"
            label="Observações"
            extra="Opcional. Use para detalhar atestado, número do CID (se aplicável) ou outras informações."
          >
            <Input.TextArea rows={3} maxLength={1000} showCount />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
