import { App, Button, Result, Skeleton } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { ApiError } from '@/shared/api/api-error';
import { DataProtectionNotice } from '@/shared/components/DataProtectionNotice/DataProtectionNotice';
import { PageHeading } from '@/shared/components/PageHeading/PageHeading';
import { ResidentForm } from '../components/ResidentForm/ResidentForm';
import { SingleFormNotice } from '../components/SingleFormNotice/SingleFormNotice';
import { useResidentQuery, useSaveResidentMutation } from '../hooks/use-residents';
import { residentFormMapper } from '../model/resident-form.mapper';
import type { ResidentFormValues } from '../model/resident-form.types';

/** CPF ou unidade já cadastrados: nada a repetir, o cadastro existe em outro lugar. */
const CONFLICT_STATUS = 409;

/**
 * Navegadores só fecham a aba que o próprio site abriu. Quando a chamada não
 * surte efeito, a tela de agradecimento continua no lugar do formulário, o que
 * também evita um segundo envio da mesma unidade.
 */
const closePage = () => window.close();

export function ResidentFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { message, modal } = App.useApp();
  const { isAuthenticated } = useAuth();

  const residentQuery = useResidentQuery(id);
  const saveResident = useSaveResidentMutation();
  const [sentByResident, setSentByResident] = useState(false);

  const initialValues = useMemo(
    () => (residentQuery.data ? residentFormMapper.toFormValues(residentQuery.data) : undefined),
    [residentQuery.data],
  );

  /**
   * O envio falho fica em diálogo, não em aviso passageiro: o morador acabou de
   * preencher a ficha inteira e a resposta costuma pedir uma providência —
   * procurar a administração, corrigir o CPF — que ele precisa ler com calma.
   */
  const showFailure = (error: unknown) => {
    const conflict = error instanceof ApiError && error.status === CONFLICT_STATUS;

    modal[conflict ? 'warning' : 'error']({
      title: conflict ? 'Cadastro já existente' : 'Não foi possível salvar o cadastro',
      content: error instanceof ApiError ? error.message : 'Tente novamente em alguns instantes.',
      okText: 'Entendi',
      width: 520,
    });
  };

  const thankResident = (fullName: string) => {
    setSentByResident(true);

    modal.success({
      title: 'Cadastro enviado. Obrigado!',
      content: `Recebemos os dados da sua unidade, ${fullName.split(' ')[0]}. Eles serão usados apenas para o controle e a organização do condomínio. Se algo mudar, procure a administração.`,
      okText: 'Concluir',
      width: 520,
      onOk: closePage,
    });
  };

  const handleSubmit = (values: ResidentFormValues) => {
    saveResident.mutate(
      { id, payload: residentFormMapper.toPayload(values) },
      {
        onSuccess: (resident) => {
          if (!isAuthenticated) {
            thankResident(resident.fullName);

            return;
          }

          message.success(`Cadastro de ${resident.fullName} salvo com sucesso.`);
          void navigate('/moradores');
        },
        onError: showFailure,
      },
    );
  };

  if (id && residentQuery.isLoading) {
    return <Skeleton active paragraph={{ rows: 12 }} />;
  }

  if (sentByResident) {
    return (
      <Result
        status="success"
        title="Cadastro enviado"
        subTitle="Obrigado por preencher os dados da sua unidade. Você já pode fechar esta página."
        extra={
          <Button type="primary" onClick={closePage}>
            Fechar página
          </Button>
        }
      />
    );
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
        title={id ? 'Editar cadastro de morador' : 'Cadastro da unidade'}
        description={
          id
            ? 'Corrija os dados da unidade a pedido do morador.'
            : 'Um cadastro por apartamento, reunindo todos os moradores. Os dados servem ao controle e à organização do condomínio.'
        }
      />

      {id ? <DataProtectionNotice /> : <SingleFormNotice />}

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
