import { App, Button, DatePicker, Form, Input, InputNumber, Space, Steps } from 'antd';
import type { Dayjs } from 'dayjs';
import { ArrowLeft, ArrowRight, Building2, LocateFixed, MapPinned, Save } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { LITE_MAX_UNITS } from '@/features/marketing/model/plans';
import { ApiError } from '@/shared/api/api-error';
import { PlanUpgradeModal } from '@/shared/components/PlanUpgradeModal/PlanUpgradeModal';
import { rules } from '@/shared/utils/form-rules';
import { condominiumsApi } from '../api/condominiums.api';
import { AddressLocationFields } from '../components/AddressLocationFields';
import { useCreateCondominiumMutation, useMyCondominiumsQuery } from '../hooks/use-condominiums';
import { formatCondoAddress } from '../model/condo-address';
import { parseUnitNumbers, slugify } from '../model/condominium.types';
import * as S from './CreateCondominiumPage.styles';

interface FormValues {
  name: string;
  slug: string;
  unitNumbers: string;
  buildingHandoverDate?: Dayjs;
  zipCode?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  address: string;
  latitude: number;
  longitude: number;
  geofenceRadiusMeters: number;
}

const DATE_FORMAT = 'YYYY-MM-DD';

const STEPS = [
  { title: 'Identidade', fields: ['name', 'slug'] as const },
  { title: 'Unidades', fields: ['unitNumbers'] as const },
  {
    title: 'Localização',
    fields: [
      'zipCode',
      'street',
      'number',
      'neighborhood',
      'city',
      'state',
      'address',
      'latitude',
      'longitude',
      'geofenceRadiusMeters',
    ] as const,
  },
  { title: 'Revisão', fields: [] as const },
];

export function CreateCondominiumPage() {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const { session } = useAuth();
  const [form] = Form.useForm<FormValues>();
  const [step, setStep] = useState(0);
  const [slugTouched, setSlugTouched] = useState(false);
  const [previewUnits, setPreviewUnits] = useState<string[]>([]);
  const [unitUpgradeOpen, setUnitUpgradeOpen] = useState(false);
  const [condoUpgradeOpen, setCondoUpgradeOpen] = useState(false);
  const [locating, setLocating] = useState(false);
  const [geocoding, setGeocoding] = useState(false);

  const createCondominium = useCreateCondominiumMutation();
  const condominiumsQuery = useMyCondominiumsQuery();
  const plan = session?.user.plan ?? 'lite';
  const isSystemOwner = Boolean(session?.user.isSystemOwner);
  const condominiums = condominiumsQuery.data ?? [];
  const ownedCount = condominiums.filter((condo) => condo.myRole === 'OWNER').length;
  const isDoormanWithoutOwnership =
    !isSystemOwner &&
    ownedCount === 0 &&
    condominiums.some((condo) => condo.myRole === 'DOORMAN');

  // preserve: true — steps unmount Form.Items; without this, review sees empty values
  const watched = Form.useWatch([], { form, preserve: true });
  const review = useMemo(() => {
    const values = (watched ?? {}) as Partial<FormValues>;
    const units = parseUnitNumbers(values.unitNumbers ?? '');
    return {
      name: values.name?.trim() || '—',
      slug: values.slug ? `/c/${slugify(values.slug)}` : '—',
      units,
      handover: values.buildingHandoverDate
        ? values.buildingHandoverDate.format('DD/MM/YYYY')
        : 'Não informada',
      address:
        formatCondoAddress(values).trim() ||
        String(values.address ?? '').trim() ||
        '—',
      coords:
        values.latitude != null && values.longitude != null
          ? `${values.latitude}, ${values.longitude}`
          : '—',
      radius: values.geofenceRadiusMeters ?? 100,
    };
  }, [watched]);

  useEffect(() => {
    if (condominiumsQuery.isLoading) {
      return;
    }

    if (isDoormanWithoutOwnership) {
      message.info('Contas de porteiro não podem criar condomínios.');
      void navigate('/app', { replace: true });
      return;
    }

    if (
      !isSystemOwner &&
      (plan === 'lite' || plan === 'prime') &&
      ownedCount >= 1
    ) {
      setCondoUpgradeOpen(true);
    }
  }, [
    condominiumsQuery.isLoading,
    isDoormanWithoutOwnership,
    isSystemOwner,
    message,
    navigate,
    ownedCount,
    plan,
  ]);

  const handleNameChange = (name: string) => {
    if (!slugTouched) {
      form.setFieldValue('slug', slugify(name));
    }
  };

  const goNext = async () => {
    const currentStep = STEPS[step];
    if (!currentStep) return;
    const fields = [...currentStep.fields];

    try {
      if (fields.length > 0) {
        await form.validateFields(fields);
      }

      if (step === 1) {
        const units = parseUnitNumbers(String(form.getFieldValue('unitNumbers') ?? ''));
        if (!isSystemOwner && plan === 'lite' && units.length > LITE_MAX_UNITS) {
          setUnitUpgradeOpen(true);
          return;
        }
      }

      setStep((current) => Math.min(current + 1, STEPS.length - 1));
    } catch {
      /* Ant Design highlights invalid fields */
    }
  };

  const goBack = () => {
    if (step === 0) {
      void navigate('/app');
      return;
    }

    setStep((current) => Math.max(current - 1, 0));
  };

  const handleSubmit = () => {
    // Fields from prior steps are unmounted — getFieldsValue(true) reads preserved store values.
    // Per-step validation already ran in goNext.
    const values = form.getFieldsValue(true) as FormValues;
    const name = values.name?.trim();
    const slug = values.slug?.trim();
    const unitNumbers = parseUnitNumbers(values.unitNumbers ?? '');
    const address =
      formatCondoAddress(values).trim() || String(values.address ?? '').trim();

    if (
      !name ||
      !slug ||
      unitNumbers.length === 0 ||
      !address ||
      values.latitude == null ||
      values.longitude == null
    ) {
      message.error('Dados incompletos. Volte e revise as etapas anteriores.');
      return;
    }

    if (!isSystemOwner && plan === 'lite' && unitNumbers.length > LITE_MAX_UNITS) {
      setUnitUpgradeOpen(true);
      return;
    }

    createCondominium.mutate(
      {
        name,
        slug: slugify(slug),
        unitNumbers,
        buildingHandoverDate: values.buildingHandoverDate
          ? values.buildingHandoverDate.format(DATE_FORMAT)
          : null,
        address,
        latitude: values.latitude,
        longitude: values.longitude,
        geofenceRadiusMeters: values.geofenceRadiusMeters ?? 100,
      },
      {
        onSuccess: (condominium) => {
          message.success(`Condomínio "${condominium.name}" criado com sucesso.`);
          void navigate(`/app/condominios/${condominium.id}`);
        },
        onError: (error: unknown) => {
          if (error instanceof ApiError && error.code === 'PLAN_UNIT_LIMIT') {
            setUnitUpgradeOpen(true);
            return;
          }

          if (error instanceof ApiError && error.code === 'PLAN_CONDO_LIMIT') {
            setCondoUpgradeOpen(true);
            return;
          }

          if (error instanceof ApiError && error.code === 'DOORMAN_CANNOT_CREATE_CONDO') {
            message.error(error.message);
            void navigate('/app', { replace: true });
            return;
          }

          message.error(
            error instanceof ApiError ? error.message : 'Não foi possível criar o condomínio.',
          );
        },
      },
    );
  };

  const geocodeAddress = () => {
    const values = form.getFieldsValue([
      'street',
      'number',
      'neighborhood',
      'city',
      'state',
      'zipCode',
      'address',
    ]);
    const address =
      formatCondoAddress(values).trim() || String(values.address ?? '').trim();

    if (address.length < 5) {
      message.warning('Preencha o endereço completo antes de buscar as coordenadas.');
      return;
    }

    setGeocoding(true);
    void condominiumsApi
      .geocode(address)
      .then((result) => {
        form.setFieldsValue({
          latitude: result.latitude,
          longitude: result.longitude,
          street: result.street ?? values.street,
          number: result.number ?? values.number,
          neighborhood: result.neighborhood ?? values.neighborhood,
          city: result.city ?? values.city,
          state: result.state ?? values.state,
          zipCode: result.zipCode ?? values.zipCode,
          address: result.address ?? address,
        });
        message.success('Coordenadas encontradas pelo endereço.');
      })
      .catch((error: unknown) => {
        message.error(
          error instanceof ApiError
            ? error.message
            : 'Não foi possível localizar o endereço.',
        );
      })
      .finally(() => setGeocoding(false));
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      message.error('Geolocalização não disponível.');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        form.setFieldsValue({
          latitude: Number(position.coords.latitude.toFixed(7)),
          longitude: Number(position.coords.longitude.toFixed(7)),
        });
        setLocating(false);
        message.success('Coordenadas preenchidas.');
      },
      () => {
        setLocating(false);
        message.error('Não foi possível obter a localização.');
      },
      { enableHighAccuracy: true, timeout: 15000 },
    );
  };

  return (
    <S.Page>
      <S.Header>
        <S.BrandMark>CondoGest</S.BrandMark>
        <S.Title>Novo condomínio</S.Title>
        <S.Lead>Cadastro guiado em etapas — identidade, unidades e localização.</S.Lead>
      </S.Header>

      <S.StepsWrap>
        <Steps
          size="small"
          current={step}
          items={STEPS.map((item) => ({ title: item.title }))}
          onChange={(next) => {
            if (next < step) setStep(next);
          }}
        />
      </S.StepsWrap>

      <S.Panel>
        <Form<FormValues>
          form={form}
          layout="vertical"
          requiredMark={false}
          disabled={createCondominium.isPending}
          initialValues={{ geofenceRadiusMeters: 100 }}
        >
          {step === 0 ? (
            <>
              <S.StepHeading>Identidade</S.StepHeading>
              <S.StepHint>Como o condomínio aparece no app e no link público dos moradores.</S.StepHint>

              <Form.Item
                name="name"
                label="Nome do condomínio"
                rules={[rules.required(), rules.text(3, 150)]}
              >
                <Input
                  prefix={<Building2 size={16} />}
                  placeholder="Residencial Jardins"
                  size="large"
                  onChange={(event) => handleNameChange(event.target.value)}
                />
              </Form.Item>

              <Form.Item
                name="slug"
                label="Endereço público (slug)"
                extra="Apenas letras minúsculas, números e hífen."
                rules={[
                  rules.required(),
                  rules.text(3, 80),
                  {
                    pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                    message: 'Use apenas letras minúsculas, números e hífen',
                  },
                ]}
              >
                <Input
                  placeholder="residencial-jardins"
                  size="large"
                  onChange={(event) => {
                    setSlugTouched(true);
                    form.setFieldValue('slug', event.target.value);
                  }}
                />
              </Form.Item>

              {form.getFieldValue('slug') ? (
                <S.SlugPreview>
                  Hub público: <code>/c/{slugify(String(form.getFieldValue('slug') ?? ''))}</code>
                </S.SlugPreview>
              ) : null}

              <Form.Item
                name="buildingHandoverDate"
                label="Data de entrega do prédio (opcional)"
                style={{ marginTop: 18 }}
              >
                <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} size="large" />
              </Form.Item>
            </>
          ) : null}

          {step === 1 ? (
            <>
              <S.StepHeading>Unidades</S.StepHeading>
              <S.StepHint>
                Informe o catálogo completo — uma unidade por linha ou separadas por vírgula.
                {plan === 'lite' && !isSystemOwner
                  ? ` Plano Lite: até ${LITE_MAX_UNITS} unidades.`
                  : null}
              </S.StepHint>

              <Form.Item
                name="unitNumbers"
                label="Números das unidades"
                rules={[
                  rules.required('Informe ao menos uma unidade'),
                  {
                    validator: (_rule, value: string | undefined) =>
                      parseUnitNumbers(value ?? '').length > 0
                        ? Promise.resolve()
                        : Promise.reject(new Error('Informe ao menos uma unidade')),
                  },
                ]}
              >
                <Input.TextArea
                  rows={8}
                  placeholder={'101\n102\n103\n201\n202'}
                  onChange={(event) => setPreviewUnits(parseUnitNumbers(event.target.value))}
                />
              </Form.Item>

              {previewUnits.length > 0 ? (
                <S.UnitCount>
                  <strong>{previewUnits.length}</strong> unidade(s) reconhecida(s)
                  {plan === 'lite' && !isSystemOwner && previewUnits.length > LITE_MAX_UNITS
                    ? ` — acima do limite Lite (${LITE_MAX_UNITS})`
                    : ''}
                </S.UnitCount>
              ) : null}
            </>
          ) : null}

          {step === 2 ? (
            <>
              <S.StepHeading>Localização</S.StepHeading>
              <S.StepHint>
                Endereço completo e coordenadas usadas no geofence do ponto eletrônico.
              </S.StepHint>

              <AddressLocationFields form={form} disabled={createCondominium.isPending} />

              <Space wrap style={{ marginBottom: 16 }}>
                <Button
                  icon={<MapPinned size={16} />}
                  loading={geocoding}
                  onClick={geocodeAddress}
                >
                  Buscar coordenadas
                </Button>
                <Button
                  icon={<LocateFixed size={16} />}
                  onClick={useMyLocation}
                  loading={locating}
                >
                  Usar minha localização
                </Button>
              </Space>

              <S.CoordsRow>
                <Form.Item
                  name="latitude"
                  label="Latitude"
                  rules={[rules.required('Informe a latitude')]}
                >
                  <InputNumber style={{ width: '100%' }} step={0.0000001} />
                </Form.Item>
                <Form.Item
                  name="longitude"
                  label="Longitude"
                  rules={[rules.required('Informe a longitude')]}
                >
                  <InputNumber style={{ width: '100%' }} step={0.0000001} />
                </Form.Item>
              </S.CoordsRow>

              <Form.Item
                name="geofenceRadiusMeters"
                label="Raio do geofence (metros)"
                extra="O ponto só é aceito dentro deste raio (50 a 2000 m)."
                rules={[rules.required()]}
              >
                <InputNumber min={50} max={2000} style={{ width: '100%' }} />
              </Form.Item>
            </>
          ) : null}

          {step === 3 ? (
            <>
              <S.StepHeading>Revisão</S.StepHeading>
              <S.StepHint>Confira os dados antes de criar o condomínio.</S.StepHint>

              <S.ReviewGrid>
                <S.ReviewItem>
                  <S.ReviewLabel>Nome</S.ReviewLabel>
                  <S.ReviewValue>{review.name}</S.ReviewValue>
                </S.ReviewItem>
                <S.ReviewItem>
                  <S.ReviewLabel>Link público</S.ReviewLabel>
                  <S.ReviewValue>{review.slug}</S.ReviewValue>
                </S.ReviewItem>
                <S.ReviewItem>
                  <S.ReviewLabel>Unidades</S.ReviewLabel>
                  <S.ReviewValue>
                    {review.units.length} unidade(s)
                    {review.units.length > 0
                      ? ` · ${review.units.slice(0, 8).join(', ')}${review.units.length > 8 ? '…' : ''}`
                      : ''}
                  </S.ReviewValue>
                </S.ReviewItem>
                <S.ReviewItem>
                  <S.ReviewLabel>Entrega do prédio</S.ReviewLabel>
                  <S.ReviewValue>{review.handover}</S.ReviewValue>
                </S.ReviewItem>
                <S.ReviewItem>
                  <S.ReviewLabel>Endereço</S.ReviewLabel>
                  <S.ReviewValue>{review.address}</S.ReviewValue>
                </S.ReviewItem>
                <S.ReviewItem>
                  <S.ReviewLabel>Coordenadas</S.ReviewLabel>
                  <S.ReviewValue>{review.coords}</S.ReviewValue>
                </S.ReviewItem>
                <S.ReviewItem>
                  <S.ReviewLabel>Raio do geofence</S.ReviewLabel>
                  <S.ReviewValue>{review.radius} m</S.ReviewValue>
                </S.ReviewItem>
              </S.ReviewGrid>
            </>
          ) : null}

          <S.Actions>
            <Button onClick={goBack} icon={step === 0 ? undefined : <ArrowLeft size={16} />}>
              {step === 0 ? 'Cancelar' : 'Voltar'}
            </Button>

            <S.ActionGroup>
              {step < STEPS.length - 1 ? (
                <Button type="primary" onClick={() => void goNext()} icon={<ArrowRight size={16} />}>
                  Continuar
                </Button>
              ) : (
                <Button
                  type="primary"
                  onClick={handleSubmit}
                  icon={<Save size={16} />}
                  loading={createCondominium.isPending}
                >
                  Criar condomínio
                </Button>
              )}
            </S.ActionGroup>
          </S.Actions>
        </Form>
      </S.Panel>

      <PlanUpgradeModal
        open={unitUpgradeOpen}
        onClose={() => setUnitUpgradeOpen(false)}
        title="Limite de unidades do Lite"
        description={`O plano Lite inclui até ${LITE_MAX_UNITS} unidades no catálogo do condomínio. Para unidades ilimitadas, faça upgrade para o plano Prime.`}
        upgradePlanId="prime"
      />

      <PlanUpgradeModal
        open={condoUpgradeOpen}
        onClose={() => {
          setCondoUpgradeOpen(false);
          void navigate('/app');
        }}
        title="Limite do seu plano"
        description="Os planos Lite e Prime permitem gerenciar apenas 1 condomínio. Para cadastrar vários prédios, faça upgrade para o plano Gestor."
        upgradePlanId="gestor"
      />
    </S.Page>
  );
}
