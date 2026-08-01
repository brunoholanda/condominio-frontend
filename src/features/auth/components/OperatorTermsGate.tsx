import { App, Button, Form, Input, Modal } from 'antd';
import { IdCard } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

import { ApiError } from '@/shared/api/api-error';
import {
  OPERATOR_CPF_NOTICE,
  OPERATOR_DUTIES,
  OPERATOR_TERMS_ACCEPT,
  OPERATOR_TERMS_INTRO,
  OPERATOR_TERMS_TITLE,
} from '@/shared/privacy/operator-duties';
import { rules } from '@/shared/utils/form-rules';
import { maskCpf } from '@/shared/utils/masks';
import { useAuth } from '../hooks/use-auth';
import { operatorTermsStore } from '../model/operator-terms.store';
import * as S from './OperatorTermsGate.styles';

interface OperatorTermsGateProps {
  children: ReactNode;
}

interface TermsFormValues {
  cpf: string;
}

/**
 * Exige o aceite dos deveres da LGPD antes de liberar a área restrita e, de
 * quem ainda não se identificou, o CPF que responde pelo uso dos dados.
 * Enquanto isso não acontece nada é renderizado por baixo do diálogo, então
 * nenhum dado pessoal chega a ser buscado na API.
 */
export function OperatorTermsGate({ children }: OperatorTermsGateProps) {
  const { session, identify, logout } = useAuth();
  const { message } = App.useApp();
  const [form] = Form.useForm<TermsFormValues>();
  const userId = session?.user.id ?? '';
  const needsCpf = session !== null && !session.user.cpf;
  const [accepted, setAccepted] = useState(() => operatorTermsStore.isAccepted(userId));
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => setAccepted(operatorTermsStore.isAccepted(userId)), [userId]);

  const accept = () => {
    operatorTermsStore.accept(userId);
    setAccepted(true);
  };

  const handleAccept = async () => {
    if (!needsCpf) {
      accept();

      return;
    }

    setSubmitting(true);

    try {
      const { cpf } = await form.validateFields();

      await identify(cpf);
      accept();
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        message.error(error.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (accepted) {
    return <>{children}</>;
  }

  return (
    <Modal
      open
      closable={false}
      maskClosable={false}
      keyboard={false}
      width={640}
      title={OPERATOR_TERMS_TITLE}
      footer={[
        <Button key="logout" disabled={submitting} onClick={logout}>
          Sair
        </Button>,
        <Button key="accept" type="primary" loading={submitting} onClick={() => void handleAccept()}>
          {OPERATOR_TERMS_ACCEPT}
        </Button>,
      ]}
    >
      <S.Intro>{OPERATOR_TERMS_INTRO}</S.Intro>
      <S.Duties>
        {OPERATOR_DUTIES.map((duty) => (
          <li key={duty}>{duty}</li>
        ))}
      </S.Duties>

      {needsCpf ? (
        <S.Identification>
          <Form form={form} layout="vertical" requiredMark={false} disabled={submitting}>
            <Form.Item
              name="cpf"
              label="Seu CPF"
              extra={OPERATOR_CPF_NOTICE}
              normalize={maskCpf}
              rules={[rules.required('Informe seu CPF para continuar'), rules.cpf()]}
            >
              <Input
                placeholder="000.000.000-00"
                inputMode="numeric"
                prefix={<IdCard size={15} />}
              />
            </Form.Item>
          </Form>
        </S.Identification>
      ) : null}
    </Modal>
  );
}
