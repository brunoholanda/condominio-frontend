import {
  App,
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Steps,
  Switch,
} from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  Briefcase,
  KeyRound,
  Save,
  UserRound,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { condominiumsApi } from '@/features/condominiums/api/condominiums.api';
import { useManagerCondominium } from '@/features/condominiums/components/ManagerLayout';
import { formatCondoAddress } from '@/features/condominiums/model/condo-address';
import { ApiError } from '@/shared/api/api-error';
import { MoneyInput } from '@/shared/components/MoneyInput/MoneyInput';
import { PageHeading } from '@/shared/components/PageHeading/PageHeading';
import { PhoneInput } from '@/shared/components/PhoneInput/PhoneInput';
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { rules } from '@/shared/utils/form-rules';
import { maskCep, maskCpf, maskPhone, onlyDigits } from '@/shared/utils/masks';
import { queries } from '@/styles/theme';
import {
  useCreateEmployeeMutation,
  useEmployeeQuery,
  useUpdateEmployeeMutation,
} from '../hooks/use-staff';
import {
  ACCOUNT_TYPE_LABELS,
  ACCOUNT_TYPES,
  CONTRACT_TYPE_LABELS,
  CONTRACT_TYPES,
  type EmployeePayload,
} from '../model/staff.types';
import { BRAZILIAN_BANK_OPTIONS, findBankByCode } from '../model/brazilian-banks';
import { WorkScheduleInput } from '../components/WorkScheduleInput';
import * as S from './EmployeeFormPage.styles';

interface FormValues extends Omit<EmployeePayload, 'birthDate' | 'admissionDate' | 'benefits'> {
  birthDate?: Dayjs | null;
  admissionDate?: Dayjs | null;
  pin?: string;
  benefitsText?: string;
}

type StepKey = 'pessoais' | 'contrato' | 'remuneracao' | 'acesso';

interface WizardStep {
  key: StepKey;
  title: string;
  shortTitle: string;
  description: string;
  icon: ReactNode;
  fields: (keyof FormValues)[];
}

export interface EmployeeFormProps {
  /** `undefined` ou `"novo"` = cadastro. */
  employeeId?: string;
  /** Página completa (mobile/rota) ou conteúdo embutido no modal (desktop). */
  layout?: 'page' | 'modal';
  onCancel?: () => void;
  onCreated?: (employeeId: string) => void;
}

function benefitsToText(benefits: { name: string; value?: number | null }[] | undefined): string {
  if (!benefits?.length) {
    return '';
  }

  return benefits
    .map((b) => (b.value != null ? `${b.name}: ${b.value}` : b.name))
    .join('\n');
}

function parseBenefits(text: string | undefined): { name: string; value?: number | null }[] {
  if (!text?.trim()) {
    return [];
  }

  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [namePart, valueRaw] = line.split(':').map((part) => part.trim());
      const name = namePart ?? line;
      const value = valueRaw ? Number(valueRaw.replace(',', '.')) : null;

      return {
        name,
        value: valueRaw && Number.isFinite(value) ? value : null,
      };
    });
}

function buildSteps(isNew: boolean): WizardStep[] {
  return [
    {
      key: 'pessoais',
      title: 'Dados pessoais',
      shortTitle: 'Pessoais',
      description: 'Identidade, contato e endereço do funcionário.',
      icon: <UserRound size={18} />,
      fields: [
        'fullName',
        'cpf',
        'rg',
        'birthDate',
        'gender',
        'maritalStatus',
        'nationality',
        'phone',
        'email',
        'address',
        'city',
        'state',
        'zipCode',
      ],
    },
    {
      key: 'contrato',
      title: 'Contrato de trabalho',
      shortTitle: 'Contrato',
      description: 'Cargo, vínculo e jornada na operação do condomínio.',
      icon: <Briefcase size={18} />,
      fields: [
        'jobTitle',
        'department',
        'admissionDate',
        'contractType',
        'workSchedule',
        'notes',
        'isActive',
      ],
    },
    {
      key: 'remuneracao',
      title: 'Remuneração e banco',
      shortTitle: 'Remuneração',
      description: 'Salário, benefícios e dados para pagamento. Tudo opcional.',
      icon: <Banknote size={18} />,
      fields: [
        'salary',
        'benefitsText',
        'bankName',
        'bankCode',
        'agency',
        'accountNumber',
        'accountType',
        'pixKey',
      ],
    },
    {
      key: 'acesso',
      title: 'Acesso ao ponto',
      shortTitle: 'Acesso',
      description: isNew
        ? 'Defina o PIN que o funcionário usará no ponto pelo celular.'
        : 'Troque o PIN se precisar. Em branco, o atual é mantido.',
      icon: <KeyRound size={18} />,
      fields: ['pin'],
    },
  ];
}

/** Wizard de cadastro/edição de funcionário (página ou modal). */
export function EmployeeForm({
  employeeId,
  layout = 'page',
  onCancel,
  onCreated,
}: EmployeeFormProps) {
  const condominium = useManagerCondominium();
  const isNew = !employeeId || employeeId === 'novo';
  const navigate = useNavigate();
  const { message } = App.useApp();
  const isMobile = useMediaQuery(queries.downMd);
  const isModal = layout === 'modal';
  const [form] = Form.useForm<FormValues>();
  const [stepIndex, setStepIndex] = useState(0);
  const [highestStep, setHighestStep] = useState(0);
  const [lookingCep, setLookingCep] = useState(false);
  const lastCep = useRef('');

  const employeeQuery = useEmployeeQuery(condominium.id, isNew ? undefined : employeeId);
  const createEmployee = useCreateEmployeeMutation(condominium.id);
  const updateEmployee = useUpdateEmployeeMutation(condominium.id);
  const saving = createEmployee.isPending || updateEmployee.isPending;

  const steps = useMemo(() => buildSteps(isNew), [isNew]);
  const currentStep = steps[stepIndex]!;
  const isLastStep = stepIndex === steps.length - 1;

  useEffect(() => {
    if (isNew) {
      return;
    }

    setHighestStep(steps.length - 1);
  }, [isNew, steps.length]);

  useEffect(() => {
    if (!employeeQuery.data) {
      return;
    }

    const e = employeeQuery.data;
    form.setFieldsValue({
      ...e,
      phone: e.phone ? maskPhone(e.phone) : undefined,
      cpf: e.cpf ? maskCpf(e.cpf) : e.cpf,
      zipCode: e.zipCode ? maskCep(e.zipCode) : undefined,
      birthDate: e.birthDate ? dayjs(e.birthDate) : null,
      admissionDate: e.admissionDate ? dayjs(e.admissionDate) : null,
      benefitsText: benefitsToText(e.benefits),
      pin: undefined,
    });
    if (e.zipCode) {
      lastCep.current = onlyDigits(e.zipCode);
    }
  }, [employeeQuery.data, form]);

  const toPayload = (values: FormValues): EmployeePayload & { pin?: string } => ({
    fullName: values.fullName.trim(),
    cpf: onlyDigits(values.cpf),
    rg: values.rg || null,
    birthDate: values.birthDate ? values.birthDate.format('YYYY-MM-DD') : null,
    gender: values.gender || null,
    maritalStatus: values.maritalStatus || null,
    nationality: values.nationality || null,
    phone: values.phone ? onlyDigits(values.phone) : null,
    email: values.email || null,
    address: values.address || null,
    city: values.city || null,
    state: values.state ? values.state.toUpperCase() : null,
    zipCode: values.zipCode ? onlyDigits(values.zipCode) : null,
    jobTitle: values.jobTitle.trim(),
    department: values.department || null,
    admissionDate: values.admissionDate ? values.admissionDate.format('YYYY-MM-DD') : null,
    contractType: values.contractType,
    workSchedule: values.workSchedule || null,
    notes: values.notes || null,
    salary: values.salary ?? null,
    benefits: parseBenefits(values.benefitsText),
    bankName: values.bankName || null,
    bankCode: values.bankCode || null,
    agency: values.agency || null,
    accountNumber: values.accountNumber || null,
    accountType: values.accountType ?? null,
    pixKey: values.pixKey || null,
    isActive: values.isActive !== false,
    pin: values.pin,
  });

  const closeOrLeave = () => {
    if (onCancel) {
      onCancel();
      return;
    }

    void navigate(`/app/condominios/${condominium.id}/funcionarios`);
  };

  const lookupCep = async (maskedOrRaw: string) => {
    const digits = onlyDigits(maskedOrRaw);

    if (digits.length !== 8 || digits === lastCep.current) {
      return;
    }

    lastCep.current = digits;
    setLookingCep(true);

    try {
      const result = await condominiumsApi.lookupCep(digits);
      const streetLine = [result.street, result.neighborhood].filter(Boolean).join(', ');

      form.setFieldsValue({
        zipCode: result.zipCode ? maskCep(result.zipCode) : maskCep(digits),
        address:
          result.address ||
          streetLine ||
          formatCondoAddress({
            street: result.street,
            neighborhood: result.neighborhood,
            city: result.city,
            state: result.state,
            zipCode: result.zipCode,
          }) ||
          undefined,
        city: result.city || undefined,
        state: result.state || undefined,
      });
      message.success('Endereço preenchido pelo CEP.');
    } catch (error) {
      lastCep.current = '';
      message.error(
        error instanceof ApiError ? error.message : 'Não foi possível localizar o CEP.',
      );
    } finally {
      setLookingCep(false);
    }
  };

  const save = (values: FormValues) => {
    if (isNew) {
      if (!values.pin) {
        message.error('Informe o PIN de acesso ao ponto.');
        return;
      }

      createEmployee.mutate(
        { ...toPayload(values), pin: values.pin },
        {
          onSuccess: (employee) => {
            message.success('Funcionário cadastrado.');
            if (onCreated) {
              onCreated(employee.id);
              return;
            }

            void navigate(`/app/condominios/${condominium.id}/funcionarios/${employee.id}`);
          },
          onError: (error: unknown) => {
            if (error instanceof ApiError && error.code === 'CONDO_LOCATION_REQUIRED') {
              message.error(error.message);
              void navigate(`/app/condominios/${condominium.id}/localizacao`);
              return;
            }

            message.error(
              error instanceof ApiError ? error.message : 'Não foi possível salvar.',
            );
          },
        },
      );
      return;
    }

    const payload = toPayload(values);
    if (!payload.pin) {
      delete payload.pin;
    }

    updateEmployee.mutate(
      { employeeId: employeeId as string, payload },
      {
        onSuccess: () => message.success('Cadastro atualizado.'),
        onError: (error: unknown) =>
          message.error(error instanceof ApiError ? error.message : 'Não foi possível salvar.'),
      },
    );
  };

  const goToStep = async (nextIndex: number) => {
    if (nextIndex === stepIndex) {
      return;
    }

    if (nextIndex > stepIndex) {
      try {
        await form.validateFields(currentStep.fields as string[]);
      } catch {
        return;
      }

      for (let i = stepIndex + 1; i < nextIndex; i += 1) {
        try {
          await form.validateFields(steps[i]!.fields as string[]);
        } catch {
          setStepIndex(i);
          setHighestStep((prev) => Math.max(prev, i));
          if (!isModal) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
          return;
        }
      }
    }

    setStepIndex(nextIndex);
    setHighestStep((prev) => Math.max(prev, nextIndex));
    if (!isModal) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleContinue = async () => {
    try {
      await form.validateFields(currentStep.fields as string[]);
    } catch {
      return;
    }

    if (isLastStep) {
      save(form.getFieldsValue(true));
      return;
    }

    const next = stepIndex + 1;
    setStepIndex(next);
    setHighestStep((prev) => Math.max(prev, next));
    if (!isModal) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (stepIndex === 0) {
      closeOrLeave();
      return;
    }

    setStepIndex((prev) => prev - 1);
  };

  const formBody = (
    <>
      <S.StepsWrap>
        <Steps
          size={isMobile || isModal ? 'small' : 'default'}
          current={stepIndex}
          onChange={(next) => {
            if (isNew && next > highestStep + 1) {
              return;
            }
            void goToStep(next);
          }}
          items={steps.map((step, index) => ({
            title: isMobile || isModal ? step.shortTitle : step.title,
            disabled: isNew && index > highestStep + 1,
          }))}
        />
      </S.StepsWrap>

      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        disabled={saving || (!isNew && employeeQuery.isLoading)}
        initialValues={{ contractType: 'CLT', isActive: true, nationality: 'Brasileira' }}
        onFinish={() => undefined}
      >
        <S.StepPanel>
          <S.StepHeader>
            <S.StepIcon aria-hidden>{currentStep.icon}</S.StepIcon>
            <div>
              <S.StepTitle>
                {stepIndex + 1}. {currentStep.title}
              </S.StepTitle>
              <S.StepDesc>{currentStep.description}</S.StepDesc>
            </div>
          </S.StepHeader>

          <S.StepBody>
            <div hidden={currentStep.key !== 'pessoais'}>
              <S.FieldGrid>
                <Form.Item
                  className="span-2"
                  name="fullName"
                  label="Nome completo"
                  rules={[rules.required(), rules.text(3, 150)]}
                >
                  <Input placeholder="Nome completo" />
                </Form.Item>
                <Form.Item
                  name="cpf"
                  label="CPF"
                  rules={[rules.required(), rules.cpf()]}
                  getValueFromEvent={(e) => maskCpf(e.target.value)}
                >
                  <Input maxLength={14} inputMode="numeric" />
                </Form.Item>
                <Form.Item name="rg" label="RG">
                  <Input maxLength={20} />
                </Form.Item>
                <Form.Item name="birthDate" label="Data de nascimento">
                  <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="gender" label="Gênero">
                  <Select
                    allowClear
                    options={[
                      { value: 'Feminino', label: 'Feminino' },
                      { value: 'Masculino', label: 'Masculino' },
                      { value: 'Outro', label: 'Outro' },
                    ]}
                  />
                </Form.Item>
                <Form.Item name="maritalStatus" label="Estado civil">
                  <Select
                    allowClear
                    options={[
                      'Solteiro(a)',
                      'Casado(a)',
                      'Divorciado(a)',
                      'Viúvo(a)',
                      'União estável',
                    ].map((v) => ({ value: v, label: v }))}
                  />
                </Form.Item>
                <Form.Item name="nationality" label="Nacionalidade">
                  <Input />
                </Form.Item>
                <Form.Item
                  name="phone"
                  label="Telefone"
                  normalize={maskPhone}
                  rules={[rules.phone()]}
                >
                  <PhoneInput />
                </Form.Item>
                <Form.Item name="email" label="E-mail" rules={[rules.email()]}>
                  <Input placeholder="email@exemplo.com" />
                </Form.Item>
                <Form.Item
                  name="zipCode"
                  label="CEP"
                  normalize={maskCep}
                  extra={
                    lookingCep ? 'Buscando endereço…' : 'Ao completar o CEP, o endereço é preenchido.'
                  }
                  rules={[
                    {
                      validator: async (_, value: string | undefined) => {
                        if (!value || onlyDigits(value).length === 8) return;
                        throw new Error('CEP inválido');
                      },
                    },
                  ]}
                >
                  <Input
                    placeholder="00000-000"
                    maxLength={9}
                    inputMode="numeric"
                    disabled={lookingCep}
                    onChange={(event) => {
                      const digits = onlyDigits(event.target.value);
                      if (digits.length < 8) lastCep.current = '';
                      if (digits.length === 8) void lookupCep(digits);
                    }}
                  />
                </Form.Item>
                <Form.Item name="city" label="Cidade">
                  <Input />
                </Form.Item>
                <Form.Item name="state" label="UF">
                  <Input maxLength={2} placeholder="SP" />
                </Form.Item>
                <Form.Item className="span-2" name="address" label="Endereço">
                  <Input placeholder="Rua, número, complemento" />
                </Form.Item>
              </S.FieldGrid>
            </div>

            <div hidden={currentStep.key !== 'contrato'}>
              <S.FieldGrid>
                <Form.Item
                  className="span-2"
                  name="jobTitle"
                  label="Cargo"
                  rules={[rules.required(), rules.text(2, 100)]}
                >
                  <Input placeholder="Porteiro, Zelador..." />
                </Form.Item>
                <Form.Item name="department" label="Departamento">
                  <Input placeholder="Portaria, Manutenção..." />
                </Form.Item>
                <Form.Item name="admissionDate" label="Data de admissão">
                  <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                  name="contractType"
                  label="Tipo de contrato"
                  rules={[rules.required()]}
                >
                  <Select
                    options={CONTRACT_TYPES.map((value) => ({
                      value,
                      label: CONTRACT_TYPE_LABELS[value],
                    }))}
                  />
                </Form.Item>
                <Form.Item
                  className="span-2"
                  name="workSchedule"
                  label="Jornada / horário"
                  extra="Escolha um atalho ou monte os dias e horários. O texto é salvo no cadastro."
                >
                  <WorkScheduleInput />
                </Form.Item>
                <Form.Item className="span-2" name="notes" label="Observações">
                  <Input.TextArea rows={3} placeholder="Informações extras do vínculo" />
                </Form.Item>
                <Form.Item name="isActive" label="Funcionário ativo" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </S.FieldGrid>
            </div>

            <div hidden={currentStep.key !== 'remuneracao'}>
              <S.FieldGrid>
                <Form.Item name="salary" label="Salário (R$)">
                  <MoneyInput min={0} />
                </Form.Item>
                <Form.Item
                  className="span-2"
                  name="benefitsText"
                  label="Benefícios"
                  extra="Um por linha. Opcional: nome: valor em reais (ex.: Vale refeição: 500,00)"
                >
                  <Input.TextArea
                    rows={4}
                    placeholder={'Vale transporte\nVale refeição: 500'}
                  />
                </Form.Item>
                <Form.Item name="bankCode" label="Banco" className="span-2">
                  <Select
                    showSearch
                    allowClear
                    placeholder="Digite para buscar o banco"
                    optionFilterProp="label"
                    options={BRAZILIAN_BANK_OPTIONS}
                    onChange={(code: string | undefined) => {
                      const bank = findBankByCode(code);
                      form.setFieldsValue({
                        bankCode: bank?.code,
                        bankName: bank?.name,
                      });
                    }}
                  />
                </Form.Item>
                <Form.Item name="bankName" hidden>
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Código do banco"
                  extra="Preenchido automaticamente ao escolher o banco."
                  shouldUpdate={(prev, next) => prev.bankCode !== next.bankCode}
                >
                  {() => (
                    <Input readOnly value={form.getFieldValue('bankCode') || ''} placeholder="—" />
                  )}
                </Form.Item>
                <Form.Item name="agency" label="Agência">
                  <Input />
                </Form.Item>
                <Form.Item name="accountNumber" label="Conta">
                  <Input />
                </Form.Item>
                <Form.Item name="accountType" label="Tipo de conta">
                  <Select
                    allowClear
                    options={ACCOUNT_TYPES.map((value) => ({
                      value,
                      label: ACCOUNT_TYPE_LABELS[value],
                    }))}
                  />
                </Form.Item>
                <Form.Item name="pixKey" label="Chave PIX">
                  <Input />
                </Form.Item>
              </S.FieldGrid>
            </div>

            <div hidden={currentStep.key !== 'acesso'}>
              <S.FieldGrid>
                <Form.Item
                  className="span-2"
                  name="pin"
                  label={isNew ? 'PIN (4 a 6 dígitos)' : 'Novo PIN (deixe em branco para manter)'}
                  rules={
                    isNew
                      ? [
                          rules.required('Informe o PIN'),
                          { pattern: /^\d{4,6}$/, message: 'PIN com 4 a 6 dígitos' },
                        ]
                      : [{ pattern: /^\d{4,6}$/, message: 'PIN com 4 a 6 dígitos' }]
                  }
                  extra="O funcionário usa CPF + PIN na página pública de ponto no celular."
                >
                  <Input.Password maxLength={6} inputMode="numeric" autoComplete="off" />
                </Form.Item>
              </S.FieldGrid>
            </div>
          </S.StepBody>
        </S.StepPanel>

        <S.Actions>
          <div>
            <S.ProgressHint>
              Etapa {stepIndex + 1} de {steps.length}
            </S.ProgressHint>
          </div>

          <S.ActionsRight>
            <Button icon={<ArrowLeft size={16} />} onClick={handleBack} disabled={saving}>
              {stepIndex === 0 ? 'Cancelar' : 'Voltar'}
            </Button>
            <Button
              type="primary"
              icon={isLastStep ? <Save size={16} /> : <ArrowRight size={16} />}
              loading={saving}
              onClick={() => void handleContinue()}
            >
              {isLastStep ? 'Salvar' : 'Continuar'}
            </Button>
          </S.ActionsRight>
        </S.Actions>
      </Form>
    </>
  );

  if (isModal) {
    return <S.ModalBody>{formBody}</S.ModalBody>;
  }

  return (
    <S.Page>
      <PageHeading
        title={isNew ? 'Novo funcionário' : 'Ficha do funcionário'}
        description="Cadastro em etapas: pessoais, contrato, remuneração e acesso ao ponto."
      />

      <S.Card>{formBody}</S.Card>
    </S.Page>
  );
}

/** Rota de página: `/funcionarios/novo` ou `/funcionarios/:id`. */
export function EmployeeFormPage() {
  const { id } = useParams<{ id: string }>();

  return <EmployeeForm employeeId={id} layout="page" />;
}
