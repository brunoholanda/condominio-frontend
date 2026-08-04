import { App, Button, DatePicker, Popconfirm, Select, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { type Dayjs } from 'dayjs';
import { Camera, Download, ExternalLink, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

import { useManagerCondominium } from '@/features/condominiums/components/ManagerLayout';
import { authSessionStore } from '@/features/auth/model/auth-session.store';
import { ApiError } from '@/shared/api/api-error';
import { PageHeading } from '@/shared/components/PageHeading/PageHeading';
import { staffApi } from '../api/staff.api';
import {
  useEmployeesQuery,
  useExportPunchesCsvMutation,
  usePunchesQuery,
  usePurgePunchSelfiesMutation,
} from '../hooks/use-staff';
import {
  PUNCH_STATUSES,
  PUNCH_TYPE_LABELS,
  type PunchStatus,
  type PunchType,
  type TimePunch,
} from '../model/staff.types';
import * as S from './PunchesAdminPage.styles';

export function PunchesAdminPage() {
  const condominium = useManagerCondominium();
  const { message } = App.useApp();
  const [day, setDay] = useState<Dayjs>(dayjs());
  const [employeeId, setEmployeeId] = useState<string | undefined>();
  const [status, setStatus] = useState<PunchStatus | undefined>();
  const employeesQuery = useEmployeesQuery(condominium.id);
  const exportCsv = useExportPunchesCsvMutation(condominium.id);
  const purgeSelfies = usePurgePunchSelfiesMutation(condominium.id);

  const filters = useMemo(
    () => ({
      from: day.format('YYYY-MM-DD'),
      to: day.format('YYYY-MM-DD'),
      employeeId,
      status,
    }),
    [day, employeeId, status],
  );

  const punchesQuery = usePunchesQuery(condominium.id, filters);
  const pontoUrl = `${window.location.origin}/c/${condominium.slug}/ponto`;

  const openSelfie = async (punch: TimePunch) => {
    const token = authSessionStore.read()?.accessToken;

    if (!token) {
      message.error('Sessão expirada.');
      return;
    }

    try {
      const response = await fetch(staffApi.selfieUrl(condominium.id, punch.id), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Falha ao carregar selfie');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {
      message.error('Não foi possível abrir a selfie.');
    }
  };

  const handleExport = () => {
    exportCsv.mutate(filters, {
      onSuccess: (blob) => {
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `ponto-${filters.from}.csv`;
        anchor.click();
        URL.revokeObjectURL(url);
        message.success('CSV exportado.');
      },
      onError: (error: unknown) =>
        message.error(
          error instanceof ApiError ? error.message : 'Não foi possível exportar o CSV.',
        ),
    });
  };

  const handlePurge = () => {
    purgeSelfies.mutate(undefined, {
      onSuccess: (result) =>
        message.success(
          result.purged > 0
            ? `${result.purged} selfie(s) removida(s).`
            : 'Nenhuma selfie para remover.',
        ),
      onError: (error: unknown) =>
        message.error(
          error instanceof ApiError ? error.message : 'Não foi possível limpar as selfies.',
        ),
    });
  };

  const columns: ColumnsType<TimePunch> = [
    {
      title: 'Horário',
      dataIndex: 'punchedAt',
      render: (value: string) => dayjs(value).format('DD/MM/YYYY HH:mm:ss'),
    },
    {
      title: 'Funcionário',
      dataIndex: 'employeeName',
      render: (name: string | undefined) => name ?? '—',
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      render: (type: PunchType) => PUNCH_TYPE_LABELS[type],
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (value: PunchStatus) => (
        <Tag color={value === 'ACCEPTED' ? 'green' : 'red'}>
          {value === 'ACCEPTED' ? 'Aceito' : 'Rejeitado'}
        </Tag>
      ),
    },
    {
      title: 'Distância',
      dataIndex: 'distanceMeters',
      render: (m: number) => `${Math.round(m)} m`,
    },
    {
      title: 'Motivo',
      dataIndex: 'rejectedReason',
      render: (reason: string | null) => reason ?? '—',
    },
    {
      title: 'Selfie',
      key: 'selfie',
      width: 90,
      render: (_, row) =>
        row.hasSelfie ? (
          <Button type="link" icon={<Camera size={16} />} onClick={() => void openSelfie(row)}>
            Ver
          </Button>
        ) : (
          '—'
        ),
    },
  ];

  return (
    <>
      <PageHeading
        title="Ponto eletrônico"
        description="Marcações do dia com GPS e selfie. Funcionários batem ponto pelo celular."
        actions={
          <Space wrap>
            <Button
              icon={<Download size={16} />}
              loading={exportCsv.isPending}
              onClick={handleExport}
            >
              Exportar CSV
            </Button>
            <Popconfirm
              title="Remover selfies antigas?"
              description="Selfies além do prazo de retenção serão apagadas permanentemente."
              okText="Remover"
              cancelText="Cancelar"
              okButtonProps={{ danger: true }}
              onConfirm={handlePurge}
            >
              <Button danger icon={<Trash2 size={16} />} loading={purgeSelfies.isPending}>
                Limpar selfies
              </Button>
            </Popconfirm>
            <Button
              icon={<ExternalLink size={16} />}
              href={pontoUrl}
              target="_blank"
              rel="noreferrer"
            >
              Abrir página de ponto
            </Button>
          </Space>
        }
      />

      <S.Filters>
        <DatePicker value={day} onChange={(value) => value && setDay(value)} format="DD/MM/YYYY" />
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
          placeholder="Status"
          style={{ minWidth: 140 }}
          value={status}
          onChange={setStatus}
          options={PUNCH_STATUSES.map((value) => ({
            value,
            label: value === 'ACCEPTED' ? 'Aceito' : 'Rejeitado',
          }))}
        />
      </S.Filters>

      <S.Card>
        <Table
          rowKey="id"
          loading={punchesQuery.isLoading}
          columns={columns}
          dataSource={punchesQuery.data ?? []}
          pagination={{ pageSize: 30 }}
        />
      </S.Card>
    </>
  );
}
