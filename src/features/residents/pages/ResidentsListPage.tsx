import { App, Button, Input, Popconfirm, Select, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Pencil, Search, Trash2, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ApiError } from '@/shared/api/api-error';
import { PageHeading } from '@/shared/components/PageHeading/PageHeading';
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { maskCpf, maskPhone } from '@/shared/utils/masks';
import { queries } from '@/styles/theme';
import { useDeleteResidentMutation, useResidentsQuery } from '../hooks/use-residents';
import type { OccupancyType, Resident, ResidentFilters } from '../model/resident.types';
import { OCCUPANCY_TYPE_LABELS, OCCUPANCY_TYPES } from '../model/resident.types';
import * as S from './ResidentsListPage.styles';

const INITIAL_FILTERS: ResidentFilters = { page: 1, limit: 10 };

const OCCUPANCY_FILTER_OPTIONS = OCCUPANCY_TYPES.map((value) => ({
  value,
  label: OCCUPANCY_TYPE_LABELS[value],
}));

export function ResidentsListPage() {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const isMobile = useMediaQuery(queries.downMd);
  const [filters, setFilters] = useState<ResidentFilters>(INITIAL_FILTERS);

  const residentsQuery = useResidentsQuery(filters);
  const deleteResident = useDeleteResidentMutation();

  const handleDelete = (resident: Resident) => {
    deleteResident.mutate(resident.id, {
      onSuccess: () => message.success(`Cadastro de ${resident.fullName} removido.`),
      onError: (error: unknown) =>
        message.error(
          error instanceof ApiError ? error.message : 'Não foi possível remover o cadastro.',
        ),
    });
  };

  const columns: ColumnsType<Resident> = [
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
      render: (vehicles: Resident['vehicles']) => vehicles.length,
    },
    {
      title: 'Ações',
      key: 'actions',
      width: isMobile ? 96 : 160,
      align: 'right',
      render: (_value, resident) => (
        <S.RowActions>
          <Button
            type="text"
            size="small"
            icon={<Pencil size={15} />}
            aria-label={`Editar cadastro de ${resident.fullName}`}
            onClick={() => void navigate(`/moradores/${resident.id}`)}
          >
            {isMobile ? null : 'Editar'}
          </Button>
          <Popconfirm
            title="Remover cadastro"
            description="Os dados vinculados também serão apagados."
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
        description="Consulte, edite ou remova os cadastros enviados pelas unidades."
        actions={
          <Button
            type="primary"
            icon={<UserPlus size={16} />}
            onClick={() => void navigate('/cadastro')}
          >
            Novo cadastro
          </Button>
        }
      />

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

      <Table<Resident>
        rowKey="id"
        columns={columns}
        dataSource={residentsQuery.data?.items ?? []}
        loading={residentsQuery.isFetching}
        size={isMobile ? 'small' : 'middle'}
        scroll={{ x: 'max-content' }}
        pagination={{
          current: filters.page,
          pageSize: filters.limit,
          total: residentsQuery.data?.total ?? 0,
          simple: isMobile,
          showSizeChanger: !isMobile,
          showTotal: isMobile ? undefined : (total) => `${total} cadastro(s)`,
          onChange: (page, limit) => setFilters((current) => ({ ...current, page, limit })),
        }}
      />
    </>
  );
}
