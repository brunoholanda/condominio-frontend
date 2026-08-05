import { App, Button, Modal, Popconfirm, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { MapPin, Pencil, Plus, Trash2, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useManagerCondominium } from '@/features/condominiums/components/ManagerLayout';
import { ApiError } from '@/shared/api/api-error';
import { PageHeading } from '@/shared/components/PageHeading/PageHeading';
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { maskCpf, maskPhone } from '@/shared/utils/masks';
import { queries } from '@/styles/theme';
import { useDeleteEmployeeMutation, useEmployeesQuery } from '../hooks/use-staff';
import type { EmployeeListItem } from '../model/staff.types';
import { EmployeeForm } from './EmployeeFormPage';
import * as S from './EmployeesListPage.styles';

export function EmployeesListPage() {
  const condominium = useManagerCondominium();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const isMobile = useMediaQuery(queries.downMd);
  const [createOpen, setCreateOpen] = useState(false);
  const employeesQuery = useEmployeesQuery(condominium.id);
  const deleteEmployee = useDeleteEmployeeMutation(condominium.id);
  const hasLocation = Boolean(
    condominium.address && condominium.latitude != null && condominium.longitude != null,
  );

  const openCreate = () => {
    if (isMobile) {
      void navigate(`/app/condominios/${condominium.id}/funcionarios/novo`);
      return;
    }

    setCreateOpen(true);
  };

  const columns: ColumnsType<EmployeeListItem> = [
    {
      title: 'Nome',
      dataIndex: 'fullName',
      render: (name: string, row) => (
        <Space>
          <UserRound size={16} aria-hidden />
          <span>
            {name}
            {!row.isActive ? (
              <Tag style={{ marginLeft: 8 }} color="default">
                Inativo
              </Tag>
            ) : null}
          </span>
        </Space>
      ),
    },
    {
      title: 'CPF',
      dataIndex: 'cpf',
      render: (cpf: string) => maskCpf(cpf),
    },
    { title: 'Cargo', dataIndex: 'jobTitle' },
    {
      title: 'Departamento',
      dataIndex: 'department',
      render: (value: string | null) => value ?? '—',
    },
    {
      title: 'Telefone',
      dataIndex: 'phone',
      render: (phone: string | null) => (phone ? maskPhone(phone) : '—'),
    },
    {
      title: '',
      key: 'actions',
      width: 120,
      render: (_, row) => (
        <Space>
          <Button
            type="text"
            icon={<Pencil size={16} />}
            aria-label="Editar"
            onClick={() =>
              void navigate(`/app/condominios/${condominium.id}/funcionarios/${row.id}`)
            }
          />
          <Popconfirm
            title="Remover este funcionário?"
            okText="Remover"
            cancelText="Cancelar"
            onConfirm={() =>
              deleteEmployee.mutate(row.id, {
                onSuccess: () => message.success('Funcionário removido.'),
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
        title="Funcionários"
        description="Cadastro completo dos colaboradores do condomínio e acesso ao ponto eletrônico."
        actions={
          <Button
            type="primary"
            icon={<Plus size={16} />}
            disabled={!hasLocation}
            onClick={openCreate}
          >
            Novo funcionário
          </Button>
        }
      />

      {!hasLocation ? (
        <S.AlertBanner>
          <MapPin size={18} aria-hidden />
          <div>
            <strong>Localização do condomínio necessária.</strong>
            <p>
              Cadastre o endereço e o raio do geofence antes de adicionar funcionários.{' '}
              <Link to={`/app/condominios/${condominium.id}/localizacao`}>Configurar localização</Link>
            </p>
          </div>
        </S.AlertBanner>
      ) : null}

      <S.Card>
        <Table
          rowKey="id"
          loading={employeesQuery.isLoading}
          columns={columns}
          dataSource={employeesQuery.data ?? []}
          pagination={{ pageSize: 15 }}
        />
      </S.Card>

      <Modal
        open={createOpen}
        title="Novo funcionário"
        onCancel={() => setCreateOpen(false)}
        footer={null}
        width={760}
        destroyOnHidden
        styles={{ body: { maxHeight: 'min(78vh, 720px)', overflowY: 'auto' } }}
      >
        <EmployeeForm
          layout="modal"
          onCancel={() => setCreateOpen(false)}
          onCreated={() => setCreateOpen(false)}
        />
      </Modal>
    </>
  );
}
