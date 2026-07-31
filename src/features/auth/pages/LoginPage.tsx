import { App, Button, Form, Input } from 'antd';
import { LockKeyhole, LogIn, Mail } from 'lucide-react';
import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { ApiError } from '@/shared/api/api-error';
import { rules } from '@/shared/utils/form-rules';
import { useAuth } from '../hooks/use-auth';
import type { LoginPayload } from '../model/auth.types';
import * as S from './LoginPage.styles';

interface LocationState {
  from?: string;
}

export function LoginPage() {
  const { login, isAuthenticated, isBootstrapping } = useAuth();
  const { message } = App.useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = (location.state as LocationState | null)?.from ?? '/moradores';

  if (isBootstrapping) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = async (values: LoginPayload) => {
    setSubmitting(true);

    try {
      await login({
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });
      message.success('Login realizado com sucesso.');
      void navigate(redirectTo, { replace: true });
    } catch (error: unknown) {
      message.error(
        error instanceof ApiError ? error.message : 'Não foi possível autenticar. Tente novamente.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <S.Page>
      <S.Card>
        <S.Header>
          <S.Title>Acesso restrito</S.Title>
          <S.Subtitle>
            Entre com seu e-mail e senha para consultar os moradores cadastrados.
          </S.Subtitle>
        </S.Header>

        <Form layout="vertical" requiredMark={false} onFinish={handleSubmit} disabled={submitting}>
          <Form.Item name="email" label="E-mail" rules={[rules.required(), rules.email()]}>
            <Input
              prefix={<Mail size={16} />}
              placeholder="seu@email.com"
              autoComplete="username"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Senha"
            rules={[rules.required(), rules.text(8, 72)]}
          >
            <Input.Password
              prefix={<LockKeyhole size={16} />}
              placeholder="••••••••"
              autoComplete="current-password"
              size="large"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            icon={<LogIn size={16} />}
            loading={submitting}
            block
            size="large"
          >
            Entrar
          </Button>
        </Form>
      </S.Card>
    </S.Page>
  );
}
