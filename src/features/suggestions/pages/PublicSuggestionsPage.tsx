import { App, Button, Checkbox, Form, Input, Result, Select, Skeleton } from 'antd';
import { useMemo, useState, type ChangeEvent } from 'react';
import { useParams } from 'react-router-dom';

import { usePublicCondoUnitsQuery, usePublicCondominiumQuery } from '@/features/condominiums/hooks/use-condominiums';
import { buildUnitOptions } from '@/features/residents/model/condo';
import { ApiError } from '@/shared/api/api-error';
import { PageHeading } from '@/shared/components/PageHeading/PageHeading';
import { rules } from '@/shared/utils/form-rules';
import { maskCpf, onlyDigits } from '@/shared/utils/masks';
import {
  useCreateSuggestionMutation,
  useVerifySuggestionMutation,
} from '../hooks/use-suggestions';
import { RESPECT_COMMITMENT_TEXT } from '../model/suggestion.types';
import * as S from './SuggestionsPage.styles';

interface IdentityForm {
  unitNumber: string;
  cpf: string;
}

interface SuggestionForm {
  body: string;
  respectAndTransparencyCommitment: boolean;
}

/** Página pública: valida unidade+CPF e recebe sugestão com compromisso de respeito. */
export function PublicSuggestionsPage() {
  const { slug } = useParams<{ slug: string }>();
  const { message } = App.useApp();
  const [identityForm] = Form.useForm<IdentityForm>();
  const [suggestionForm] = Form.useForm<SuggestionForm>();
  const [verified, setVerified] = useState<{
    unitNumber: string;
    cpf: string;
    authorNameHint: string;
  } | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const condominiumQuery = usePublicCondominiumQuery(slug);
  const unitsQuery = usePublicCondoUnitsQuery(slug);
  const verifyMutation = useVerifySuggestionMutation(slug ?? '');
  const createMutation = useCreateSuggestionMutation(slug ?? '');

  const unitOptions = useMemo(
    () => buildUnitOptions(unitsQuery.data ?? []),
    [unitsQuery.data],
  );

  if (condominiumQuery.isError) {
    return (
      <Result
        status="404"
        title="Condomínio não encontrado"
        subTitle="Verifique o endereço acessado."
      />
    );
  }

  const handleVerify = (values: IdentityForm) => {
    const cpf = onlyDigits(values.cpf);

    verifyMutation.mutate(
      { unitNumber: values.unitNumber, cpf },
      {
        onSuccess: (result) => {
          setVerified({
            unitNumber: result.unitNumber,
            cpf,
            authorNameHint: result.authorNameHint,
          });
          message.success('Identidade confirmada. Você pode enviar sua sugestão.');
        },
        onError: (error: unknown) =>
          message.error(
            error instanceof ApiError
              ? error.message
              : 'Não foi possível validar unidade e CPF.',
          ),
      },
    );
  };

  const handleSubmit = (values: SuggestionForm) => {
    if (!verified) {
      return;
    }

    createMutation.mutate(
      {
        unitNumber: verified.unitNumber,
        cpf: verified.cpf,
        body: values.body.trim(),
        respectAndTransparencyCommitment: true,
      },
      {
        onSuccess: () => {
          setSubmitted(true);
          message.success('Sugestão enviada com sucesso.');
        },
        onError: (error: unknown) =>
          message.error(
            error instanceof ApiError ? error.message : 'Não foi possível enviar a sugestão.',
          ),
      },
    );
  };

  return (
    <>
      <PageHeading
        title="Caixa de sugestões"
        description={
          condominiumQuery.data
            ? `Espaço aberto do ${condominiumQuery.data.name} para ideias construtivas dos moradores.`
            : 'Espaço aberto para ideias construtivas dos moradores.'
        }
      />

      <S.Card>
        <S.Commitment>
          Este canal existe para fortalecer o diálogo com a administração. Pedimos que cada
          mensagem seja escrita com <strong>respeito</strong> e <strong>transparência</strong>,
          em tom construtivo, visando o bem comum do condomínio e de seus moradores.
        </S.Commitment>

        {submitted ? (
          <S.Success>
            <strong>Obrigado pela sua contribuição</strong>
            Sua sugestão foi registrada e será analisada pela administração com o mesmo
            compromisso de respeito e transparência.
          </S.Success>
        ) : null}

        {!submitted && !verified ? (
          condominiumQuery.isLoading || unitsQuery.isLoading ? (
            <Skeleton active />
          ) : (
            <Form<IdentityForm>
              form={identityForm}
              layout="vertical"
              requiredMark={false}
              onFinish={handleVerify}
              disabled={verifyMutation.isPending}
            >
              <Form.Item name="unitNumber" label="Sua unidade" rules={[rules.required()]}>
                <Select
                  showSearch
                  options={unitOptions}
                  optionFilterProp="label"
                  placeholder="Selecione a unidade"
                />
              </Form.Item>
              <Form.Item
                name="cpf"
                label="CPF do titular cadastrado"
                rules={[rules.required(), rules.cpf()]}
                getValueFromEvent={(event: ChangeEvent<HTMLInputElement>) =>
                  maskCpf(event.target.value)
                }
              >
                <Input inputMode="numeric" placeholder="000.000.000-00" maxLength={14} />
              </Form.Item>
              <Button type="primary" htmlType="submit" block loading={verifyMutation.isPending}>
                Validar e continuar
              </Button>
            </Form>
          )
        ) : null}

        {!submitted && verified ? (
          <>
            <S.Verified>
              Validado: unidade {verified.unitNumber} · {verified.authorNameHint}
            </S.Verified>
            <Form<SuggestionForm>
              form={suggestionForm}
              layout="vertical"
              requiredMark={false}
              onFinish={handleSubmit}
              disabled={createMutation.isPending}
              initialValues={{ respectAndTransparencyCommitment: false }}
            >
              <Form.Item
                name="body"
                label="Sua sugestão"
                rules={[rules.required(), rules.text(10, 4000)]}
              >
                <Input.TextArea
                  rows={6}
                  placeholder="Descreva sua ideia de forma clara, respeitosa e transparente..."
                  showCount
                  maxLength={4000}
                />
              </Form.Item>
              <Form.Item
                name="respectAndTransparencyCommitment"
                valuePropName="checked"
                rules={[
                  rules.accepted(
                    'Confirme o compromisso com o respeito e a transparência para enviar.',
                  ),
                ]}
              >
                <Checkbox>{RESPECT_COMMITMENT_TEXT}</Checkbox>
              </Form.Item>
              <Button type="primary" htmlType="submit" block loading={createMutation.isPending}>
                Enviar sugestão
              </Button>
              <Button
                type="link"
                block
                style={{ marginTop: 8 }}
                onClick={() => {
                  setVerified(null);
                  suggestionForm.resetFields();
                }}
              >
                Usar outra unidade
              </Button>
            </Form>
          </>
        ) : null}
      </S.Card>
    </>
  );
}
