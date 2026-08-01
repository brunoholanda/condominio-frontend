import { Alert, App, Button, Input } from 'antd';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';

import { ApiError } from '@/shared/api/api-error';
import { useAuth } from '../hooks/use-auth';
import type { LoginChallenge } from '../model/auth.types';
import * as S from './LoginCodeStep.styles';

const CODE_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;
/** A tentativa acabou (expirou, foi usada ou esgotou as chances). */
const GONE_STATUS = 410;

interface LoginCodeStepProps {
  challenge: LoginChallenge;
  onConfirmed: () => void;
  /** Chamado quando a tentativa morre e a pessoa precisa recomeçar. */
  onRestart: (reason?: string) => void;
}

function secondsUntil(deadline: number): number {
  return Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
}

/** Conta o tempo até `deadline`, reiniciando quando um novo prazo é definido. */
function useSecondsLeft(deadline: number): number {
  const [left, setLeft] = useState(() => secondsUntil(deadline));

  useEffect(() => {
    setLeft(secondsUntil(deadline));

    const timer = window.setInterval(() => setLeft(secondsUntil(deadline)), 1000);

    return () => window.clearInterval(timer);
  }, [deadline]);

  return left;
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);

  return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
}

/**
 * Segunda etapa do login: sem o código que chegou por e-mail, a senha não abre
 * a área restrita.
 */
export function LoginCodeStep({ challenge, onConfirmed, onRestart }: LoginCodeStepProps) {
  const { confirmLogin, resendLoginCode } = useAuth();
  const { message } = App.useApp();
  const [current, setCurrent] = useState(challenge);
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [expiresAt, setExpiresAt] = useState(() => Date.now() + challenge.expiresInSeconds * 1000);
  const [resendAt, setResendAt] = useState(() => Date.now() + RESEND_COOLDOWN_SECONDS * 1000);
  const expiresIn = useSecondsLeft(expiresAt);
  const resendIn = useSecondsLeft(resendAt);
  const expired = expiresIn === 0;

  const handleFailure = (error: unknown, fallback: string) => {
    if (error instanceof ApiError && error.status === GONE_STATUS) {
      onRestart(error.message);

      return;
    }

    message.error(error instanceof ApiError ? error.message : fallback);
  };

  const submit = async (value: string) => {
    setSubmitting(true);

    try {
      await confirmLogin(current.challengeId, value);
      onConfirmed();
    } catch (error: unknown) {
      setCode('');
      handleFailure(error, 'Não foi possível confirmar o código. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (code.length === CODE_LENGTH) {
      void submit(code);
    }
  };

  const handleResend = async () => {
    setResending(true);

    try {
      const renewed = await resendLoginCode(current.challengeId);

      setCurrent(renewed);
      setCode('');
      setExpiresAt(Date.now() + renewed.expiresInSeconds * 1000);
      setResendAt(Date.now() + RESEND_COOLDOWN_SECONDS * 1000);
      message.success(`Novo código enviado para ${renewed.email}.`);
    } catch (error: unknown) {
      handleFailure(error, 'Não foi possível reenviar o código. Tente novamente.');
    } finally {
      setResending(false);
    }
  };

  return (
    <S.Form onSubmit={handleSubmit}>
      <Alert
        type="info"
        showIcon
        message={`Código enviado para ${current.email}`}
        description="Não encontrou a mensagem? Procure na caixa de spam ou lixo eletrônico e marque como
          &quot;não é spam&quot; para receber os próximos códigos na entrada."
      />

      <S.CodeField>
        <Input.OTP
          length={CODE_LENGTH}
          value={code}
          onChange={(value) => void submit(value)}
          onInput={(values) => setCode(values.join(''))}
          disabled={submitting || expired}
          size="large"
          inputMode="numeric"
          aria-label="Código de acesso recebido por e-mail"
        />
        <S.Countdown $expired={expired}>
          {expired
            ? 'O código expirou. Peça um novo para continuar.'
            : `O código vale por mais ${formatDuration(expiresIn)}.`}
        </S.Countdown>
      </S.CodeField>

      <Button
        type="primary"
        htmlType="submit"
        icon={<ShieldCheck size={16} />}
        loading={submitting}
        disabled={code.length !== CODE_LENGTH || expired}
        block
        size="large"
      >
        Confirmar e entrar
      </Button>

      <S.Actions>
        <Button
          type="link"
          icon={<ArrowLeft size={15} />}
          disabled={submitting}
          onClick={() => onRestart()}
        >
          Usar outra conta
        </Button>
        <Button
          type="link"
          loading={resending}
          disabled={submitting || (resendIn > 0 && !expired)}
          onClick={() => void handleResend()}
        >
          {resendIn > 0 && !expired ? `Reenviar em ${resendIn}s` : 'Reenviar código'}
        </Button>
      </S.Actions>
    </S.Form>
  );
}
