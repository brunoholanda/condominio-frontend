import { App, Result, Skeleton } from 'antd';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ApiError } from '@/shared/api/api-error';
import { PageHeading } from '@/shared/components/PageHeading/PageHeading';
import { ResidentForm } from '../components/ResidentForm/ResidentForm';
import { useResidentQuery, useSaveResidentMutation } from '../hooks/use-residents';
import { residentFormMapper } from '../model/resident-form.mapper';
import type { ResidentFormValues } from '../model/resident-form.types';

export function ResidentFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { message } = App.useApp();

  const residentQuery = useResidentQuery(id);
  const saveResident = useSaveResidentMutation();

  const initialValues = useMemo(
    () => (residentQuery.data ? residentFormMapper.toFormValues(residentQuery.data) : undefined),
    [residentQuery.data],
  );

  const handleSubmit = (values: ResidentFormValues) => {
    saveResident.mutate(
      { id, payload: residentFormMapper.toPayload(values) },
      {
        onSuccess: (resident) => {
          message.success(`Cadastro de ${resident.fullName} salvo com sucesso.`);
          void navigate('/moradores');
        },
        onError: (error: unknown) => {
          message.error(
            error instanceof ApiError ? error.message : 'Não foi possível salvar o cadastro.',
          );
        },
      },
    );
  };

  if (id && residentQuery.isLoading) {
    return <Skeleton active paragraph={{ rows: 12 }} />;
  }

  if (id && residentQuery.isError) {
    return (
      <Result
        status="404"
        title="Cadastro não encontrado"
        subTitle="O morador solicitado não existe ou foi removido."
      />
    );
  }

  return (
    <>
      <PageHeading
        title={id ? 'Editar cadastro de morador' : 'Cadastro de morador'}
        description="Preencha os dados da unidade."
      />

      <ResidentForm
        key={id ?? 'new'}
        initialValues={initialValues}
        submitting={saveResident.isPending}
        submitLabel={id ? 'Salvar alterações' : 'Enviar cadastro'}
        onSubmit={handleSubmit}
      />
    </>
  );
}
