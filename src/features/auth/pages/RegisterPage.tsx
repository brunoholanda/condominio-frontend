import { App, Button, Form, Input } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight, LockKeyhole, Mail, User, UserPlus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { authApi } from '@/features/auth/api/auth.api';
import type { RegisterPayload } from '@/features/auth/model/auth.types';
import { parsePlanId, selectedPlanStore } from '@/features/marketing/model/plans';
import { ApiError } from '@/shared/api/api-error';
import { rules } from '@/shared/utils/form-rules';
import * as S from './LoginPage.styles';

interface RegisterFormValues extends RegisterPayload {
  confirmPassword: string;
}

type RegisterStep = 1 | 2;

export function RegisterPage() {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm<RegisterFormValues>();
  const [step, setStep] = useState<RegisterStep>(1);

  const selectedPlan = useMemo(
    () => parsePlanId(searchParams.get('plan')) ?? selectedPlanStore.read(),
    [searchParams],
  );

  useEffect(() => {
    if (selectedPlan) {
      selectedPlanStore.save(selectedPlan);
    }
  }, [selectedPlan]);

  const register = useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
  });

  const handleFinish = (values: RegisterFormValues) => {
    if (step === 1) {
      setStep(2);
      return;
    }

    register.mutate(
      {
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
        plan: selectedPlan ?? 'lite',
      },
      {
        onSuccess: () => {
          if (selectedPlan) {
            selectedPlanStore.save(selectedPlan);
          }
          message.success('Conta criada! Entre com seu e-mail e senha para continuar.');
          void navigate('/login', { replace: true });
        },
        onError: (error: unknown) =>
          message.error(
            error instanceof ApiError ? error.message : 'Não foi possível criar a conta.',
          ),
      },
    );
  };

  return (
    <S.Page>
      <S.Card>
        <S.Header>
          <S.Title>Criar conta</S.Title>
          <S.Subtitle>
            {step === 1
              ? 'Informe seus dados para começar.'
              : 'Defina uma senha segura para acessar a plataforma.'}
          </S.Subtitle>
        </S.Header>

        <S.StepIndicator aria-label={`Passo ${step} de 2`}>
          <S.StepDot $active={step === 1} $done={step > 1} />
          <S.StepDot $active={step === 2} />
        </S.StepIndicator>

        <S.StepLabel>{step === 1 ? '1 · Nome e e-mail' : '2 · Senha'}</S.StepLabel>

        <Form<RegisterFormValues>
          form={form}
          layout="vertical"
          requiredMark={false}
          onFinish={handleFinish}
          disabled={register.isPending}
        >
          <div hidden={step !== 1}>
            <Form.Item
              name="name"
              label="Nome completo"
              rules={step === 1 ? [rules.required(), rules.text(3, 150)] : []}
            >
              <Input
                prefix={<User size={16} />}
                placeholder="Seu nome"
                autoComplete="name"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="E-mail"
              rules={step === 1 ? [rules.required(), rules.email()] : []}
            >
              <Input
                prefix={<Mail size={16} />}
                placeholder="seu@email.com"
                autoComplete="username"
                size="large"
              />
            </Form.Item>

            <S.StepActions>
              <Button
                type="primary"
                htmlType={step === 1 ? 'submit' : 'button'}
                icon={<ArrowRight size={16} />}
                block
                size="large"
              >
                Continuar
              </Button>
            </S.StepActions>
          </div>

          <div hidden={step !== 2}>
            <Form.Item
              name="password"
              label="Senha"
              rules={step === 2 ? [rules.required(), rules.text(8, 72)] : []}
            >
              <Input.Password
                prefix={<LockKeyhole size={16} />}
                placeholder="Mínimo de 8 caracteres"
                autoComplete="new-password"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirme a senha"
              dependencies={['password']}
              rules={
                step === 2
                  ? [
                      rules.required(),
                      ({ getFieldValue }) => ({
                        validator: (_rule, value: string | undefined) =>
                          !value || value === getFieldValue('password')
                            ? Promise.resolve()
                            : Promise.reject(new Error('As senhas não coincidem')),
                      }),
                    ]
                  : []
              }
            >
              <Input.Password
                prefix={<LockKeyhole size={16} />}
                placeholder="Repita a senha"
                autoComplete="new-password"
                size="large"
              />
            </Form.Item>

            <S.StepActions>
              <Button
                type="primary"
                htmlType={step === 2 ? 'submit' : 'button'}
                icon={<UserPlus size={16} />}
                loading={register.isPending}
                block
                size="large"
              >
                Criar conta
              </Button>
              <Button
                htmlType="button"
                icon={<ArrowLeft size={16} />}
                block
                size="large"
                disabled={register.isPending}
                onClick={() => setStep(1)}
              >
                Voltar
              </Button>
            </S.StepActions>
          </div>
        </Form>

        <S.FooterLink>
          Já tem conta? <Link to="/login">Entrar</Link>
        </S.FooterLink>
      </S.Card>
    </S.Page>
  );
}
