import { App, Button, Form, Input, Result, Skeleton } from 'antd';
import { useParams } from 'react-router-dom';

import { ApiError } from '@/shared/api/api-error';
import { PageHeading } from '@/shared/components/PageHeading/PageHeading';
import { SignaturePad } from '@/shared/components/SignaturePad/SignaturePad';
import { rules } from '@/shared/utils/form-rules';
import {
  useCompletePublicSigningMutation,
  usePublicSigningSessionQuery,
} from '../hooks/use-deliveries';
import * as S from './PublicDeliverySignPage.styles';

interface SignFormValues {
  recipientName: string;
  signature: string;
}

/** Página pública aberta pelo QR Code no celular de quem retira uma encomenda. */
export function PublicDeliverySignPage() {
  const { token = '' } = useParams<{ token: string }>();
  const { message } = App.useApp();
  const [form] = Form.useForm<SignFormValues>();

  const sessionQuery = usePublicSigningSessionQuery(token);
  const complete = useCompletePublicSigningMutation(token);

  if (sessionQuery.isError) {
    return (
      <Result
        status="warning"
        title="Link inválido ou expirado"
        subTitle="Peça na portaria para gerar um novo QR Code."
      />
    );
  }

  if (complete.isSuccess) {
    return (
      <Result
        status="success"
        title="Assinatura registrada"
        subTitle="A entrega foi protocolada. Pode devolver o celular à portaria."
      />
    );
  }

  return (
    <>
      <PageHeading title="Assinar retirada de encomenda" />

      <S.Card>
        {sessionQuery.isLoading || !sessionQuery.data ? (
          <Skeleton active />
        ) : (
          <>
            <S.PackageSummary>
              <strong>{sessionQuery.data.condominiumName}</strong>
              Unidade {sessionQuery.data.unitNumber} · {sessionQuery.data.description}
            </S.PackageSummary>

            <Form<SignFormValues>
              form={form}
              layout="vertical"
              requiredMark={false}
              onFinish={(values) => {
                complete.mutate(
                  {
                    recipientName: values.recipientName.trim(),
                    signature: values.signature,
                  },
                  {
                    onError: (error: unknown) =>
                      message.error(
                        error instanceof ApiError
                          ? error.message
                          : 'Não foi possível registrar a assinatura.',
                      ),
                  },
                );
              }}
              disabled={complete.isPending}
            >
              <Form.Item
                name="recipientName"
                label="Seu nome"
                rules={[rules.required(), rules.text(3, 150)]}
              >
                <Input autoComplete="name" placeholder="Nome de quem está retirando" />
              </Form.Item>
              <Form.Item
                name="signature"
                label="Assinatura"
                rules={[rules.required('A assinatura é obrigatória')]}
                extra="Use o dedo para assinar dentro do quadro."
              >
                <SignaturePad />
              </Form.Item>
              <Button type="primary" htmlType="submit" block loading={complete.isPending}>
                Confirmar retirada
              </Button>
            </Form>
          </>
        )}
      </S.Card>
    </>
  );
}
