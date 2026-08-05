import { App, Button, Input, Popconfirm, Select, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Eye, ExternalLink, FileDown, History, Pencil, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useManagerCondominium } from '@/features/condominiums/components/ManagerLayout';
import { ApiError } from '@/shared/api/api-error';
import { DataProtectionNotice } from '@/shared/components/DataProtectionNotice/DataProtectionNotice';
import { PageHeading } from '@/shared/components/PageHeading/PageHeading';
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { EDIT_WARNING, EXPORT_WARNING } from '@/shared/privacy/operator-duties';
import { maskCpf, maskPhone } from '@/shared/utils/masks';
import { mobileOverlayWidth, mobileTableProps } from '@/shared/utils/mobile-ui';
import { queries } from '@/styles/theme';
import { ResidentDetailsDrawer } from '../components/ResidentDetailsDrawer/ResidentDetailsDrawer';
import { ResidentsSummary } from '../components/ResidentsSummary/ResidentsSummary';
import { UnitHistoryModal } from '../components/UnitHistoryModal/UnitHistoryModal';
import {
  useDeleteResidentMutation,
  useResidentsQuery,
  useResidentsReportMutation,
} from '../hooks/use-residents';
import type { OccupancyType, ResidentListItem, ResidentFilters } from '../model/resident.types';
import { OCCUPANCY_TYPE_LABELS, OCCUPANCY_TYPES } from '../model/resident.types';
import * as S from './ResidentsListPage.styles';

const INITIAL_FILTERS: ResidentFilters = { page: 1, limit: 10 };

const OCCUPANCY_FILTER_OPTIONS = OCCUPANCY_TYPES.map((value) => ({
  value,
  label: OCCUPANCY_TYPE_LABELS[value],
}));

export function ResidentsListPage() {
  const condominium = useManagerCondominium();
  const navigate = useNavigate();
  const { message, modal } = App.useApp();
  const isMobile = useMediaQuery(queries.downMd);
  const [filters, setFilters] = useState<ResidentFilters>(INITIAL_FILTERS);
  const [viewingId, setViewingId] = useState<string>();
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [historyUnit, setHistoryUnit] = useState<string | null>(null);

  const canManageHistory =
    condominium.myRole === 'OWNER' || condominium.myRole === 'MANAGER';

  const residentsQuery = useResidentsQuery(condominium.id, filters);
  const deleteResident = useDeleteResidentMutation();
  const downloadReport = useResidentsReportMutation();

  const total = residentsQuery.data?.total ?? 0;
  const publicFormUrl = `/c/${condominium.slug}/cadastro`;

  const downloadPdf = () => {
    const { search, unit, occupancyType } = filters;

    downloadReport.mutate(
      { condominiumId: condominium.id, filters: { search, unit, occupancyType } },
      {
        onSuccess: () => message.success(`PDF gerado com ${total} cadastro(s).`),
        onError: (error: unknown) =>
          message.error(
            error instanceof ApiError && error.status === 404
              ? 'Nenhum morador encontrado para os filtros aplicados.'
              : 'Não foi possível gerar o PDF. Tente novamente.',
          ),
      },
    );
  };

  /** O arquivo sai do sistema e vira responsabilidade de quem baixa: avisa antes. */
  const handleDownloadReport = () => {
    modal.confirm({
      title: `Exportar ${total} cadastro(s) em PDF?`,
      content: EXPORT_WARNING,
      okText: 'Baixar PDF',
      cancelText: 'Cancelar',
      width: mobileOverlayWidth(isMobile, 560),
      onOk: downloadPdf,
    });
  };

  const openDetails = (resident: ResidentListItem) => {
    setViewingId(resident.id);
    setIsViewOpen(true);
  };

  /**
   * A edição altera uma declaração assinada pelo morador, então o operador passa
   * antes pelas regras da LGPD — inclusive quando entra pela consulta.
   */
  const confirmEdit = (resident: { id: string; unit: string }) => {
    setIsViewOpen(false);

    modal.confirm({
      title: `Editar o cadastro da unidade ${resident.unit}?`,
      content: EDIT_WARNING,
      okText: 'Entendi, quero editar',
      cancelText: 'Cancelar',
      width: mobileOverlayWidth(isMobile, 560),
      onOk: () => void navigate(`/app/condominios/${condominium.id}/moradores/${resident.id}`),
    });
  };

  const handleDelete = (resident: ResidentListItem) => {
    deleteResident.mutate(
      { condominiumId: condominium.id, id: resident.id },
      {
        onSuccess: () => message.success(`Cadastro de ${resident.fullName} removido.`),
        onError: (error: unknown) =>
          message.error(
            error instanceof ApiError ? error.message : 'Não foi possível remover o cadastro.',
          ),
      },
    );
  };

  const columns: ColumnsType<ResidentListItem> = [
    {
      title: 'Unidade',
      dataIndex: 'unit',
      width: 110,
      render: (unit: string) => <S.Unit>{unit}</S.Unit>,
    },
    { title: 'Nome completo', dataIndex: 'fullName', ellipsis: true },
    {
      title: 'Vínculo',
      dataIndex: 'occupancyType',
      width: 130,
      responsive: ['md'],
      render: (type: OccupancyType) => (
        <Tag color={type === 'OWNER' ? 'gold' : 'blue'}>{OCCUPANCY_TYPE_LABELS[type]}</Tag>
      ),
    },
    {
      title: 'CPF',
      dataIndex: 'cpf',
      width: 150,
      responsive: ['xl'],
      render: (cpf: string) => maskCpf(cpf),
    },
    {
      title: 'Celular',
      dataIndex: 'mobilePhone',
      width: 160,
      responsive: ['lg'],
      render: (phone: string) => maskPhone(phone),
    },
    {
      title: 'Veículos',
      dataIndex: 'vehicles',
      width: 100,
      align: 'center',
      responsive: ['xl'],
      render: (vehicles: ResidentListItem['vehicles']) => vehicles.length,
    },
    {
      title: 'Ações',
      key: 'actions',
      width: isMobile ? 132 : canManageHistory ? 280 : 230,
      align: 'right',
      render: (_value, resident) => (
        <S.RowActions>
          <Button
            type="text"
            size="small"
            icon={<Eye size={15} />}
            aria-label={`Visualizar cadastro de ${resident.fullName}`}
            onClick={() => openDetails(resident)}
          >
            {isMobile ? null : 'Visualizar'}
          </Button>
          {canManageHistory ? (
            <Button
              type="text"
              size="small"
              icon={<History size={15} />}
              aria-label={`Histórico da unidade ${resident.unit}`}
              onClick={() => setHistoryUnit(resident.unit)}
            >
              {isMobile ? null : 'Histórico'}
            </Button>
          ) : null}
          <Button
            type="text"
            size="small"
            icon={<Pencil size={15} />}
            aria-label={`Editar cadastro de ${resident.fullName}`}
            onClick={() => confirmEdit(resident)}
          >
            {isMobile ? null : 'Editar'}
          </Button>
          <Popconfirm
            title="Remover cadastro"
            description="O cadastro ativo será removido. A versão atual fica arquivada por 5 anos (síndico/gestor) e depois é eliminada."
            okText="Remover"
            cancelText="Cancelar"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(resident)}
          >
            <Button type="text" size="small" danger icon={<Trash2 size={15} />} />
          </Popconfirm>
        </S.RowActions>
      ),
    },
  ];

  return (
    <>
      <PageHeading
        title="Moradores cadastrados"
        description="Visualize, edite ou remova os cadastros enviados pelas unidades. A visualização abre a ficha completa somente para leitura. O PDF traz uma página por morador e segue os filtros aplicados."
        actions={
          <Space wrap size={8}>
            <Button
              icon={<FileDown size={16} />}
              loading={downloadReport.isPending}
              disabled={total === 0}
              onClick={handleDownloadReport}
            >
              Baixar PDF
            </Button>
            <Button
              icon={<ExternalLink size={16} />}
              onClick={() => window.open(publicFormUrl, '_blank', 'noreferrer')}
            >
              Formulário público
            </Button>
          </Space>
        }
      />

      <DataProtectionNotice />

      <ResidentsSummary condominiumId={condominium.id} />

      <S.Filters>
        <Input
          allowClear
          prefix={<Search size={15} />}
          placeholder="Buscar por nome, unidade, CPF ou e-mail"
          onChange={(event) =>
            setFilters((current) => ({
              ...current,
              page: 1,
              search: event.target.value || undefined,
            }))
          }
        />
        <Select
          allowClear
          placeholder="Vínculo"
          options={OCCUPANCY_FILTER_OPTIONS}
          onChange={(occupancyType?: OccupancyType) =>
            setFilters((current) => ({ ...current, page: 1, occupancyType }))
          }
        />
      </S.Filters>

      <Table<ResidentListItem>
        rowKey="id"
        columns={columns}
        dataSource={residentsQuery.data?.items ?? []}
        loading={residentsQuery.isFetching}
        {...mobileTableProps(isMobile, {
          current: filters.page,
          pageSize: filters.limit,
          total,
          showTotal: isMobile ? undefined : (count) => `${count} cadastro(s)`,
          onChange: (page, limit) => setFilters((current) => ({ ...current, page, limit })),
        })}
      />

      <ResidentDetailsDrawer
        condominiumId={condominium.id}
        residentId={viewingId}
        open={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        onEdit={confirmEdit}
      />

      {canManageHistory ? (
        <UnitHistoryModal
          condominiumId={condominium.id}
          unit={historyUnit}
          open={Boolean(historyUnit)}
          onClose={() => setHistoryUnit(null)}
        />
      ) : null}
    </>
  );
}
