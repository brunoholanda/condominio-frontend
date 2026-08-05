import { App, Button, DatePicker, Form, Input, InputNumber, Space } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { Building2, LocateFixed, MapPinned, Save } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { condominiumsApi } from '@/features/condominiums/api/condominiums.api';
import { AddressLocationFields } from '@/features/condominiums/components/AddressLocationFields';
import { useManagerCondominium } from '@/features/condominiums/components/ManagerLayout';
import { useUpdateCondominiumMutation } from '@/features/condominiums/hooks/use-condominiums';
import {
  formatCondoAddress,
  parseCondoAddress,
} from '@/features/condominiums/model/condo-address';
import { parseUnitNumbers, slugify } from '@/features/condominiums/model/condominium.types';
import { LITE_MAX_UNITS } from '@/features/marketing/model/plans';
import { ApiError } from '@/shared/api/api-error';
import { PageHeading } from '@/shared/components/PageHeading/PageHeading';
import { PlanUpgradeModal } from '@/shared/components/PlanUpgradeModal/PlanUpgradeModal';
import { rules } from '@/shared/utils/form-rules';
import * as S from './CondoSettingsPage.styles';

interface FormValues {
  name: string;
  slug: string;
  unitNumbers: string;
  buildingHandoverDate?: Dayjs | null;
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

/** Edição dos dados cadastrais do condomínio: identidade, unidades e localização. */
export function CondoSettingsPage() {
  const condominium = useManagerCondominium();
  const { message } = App.useApp();
  const { session } = useAuth();
  const [form] = Form.useForm<FormValues>();
  const updateCondo = useUpdateCondominiumMutation();
  const [slugTouched, setSlugTouched] = useState(true);
  const [previewUnits, setPreviewUnits] = useState<string[]>([]);
  const [locating, setLocating] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [unitUpgradeOpen, setUnitUpgradeOpen] = useState(false);

  const plan = session?.user.plan ?? 'lite';
  const isSystemOwner = Boolean(session?.user.isSystemOwner);

  useEffect(() => {
    const parts = parseCondoAddress(condominium.address);
    const unitText = condominium.unitNumbers.join('\n');

    form.setFieldsValue({
      name: condominium.name,
      slug: condominium.slug,
      unitNumbers: unitText,
      buildingHandoverDate: condominium.buildingHandoverDate
        ? dayjs(condominium.buildingHandoverDate)
        : null,
      ...parts,
      address: condominium.address ?? formatCondoAddress(parts),
      latitude: condominium.latitude ?? undefined,
      longitude: condominium.longitude ?? undefined,
      geofenceRadiusMeters: condominium.geofenceRadiusMeters ?? 100,
    });
    setPreviewUnits(condominium.unitNumbers);
    setSlugTouched(true);
  }, [condominium, form]);

  const handleNameChange = (name: string) => {
    if (!slugTouched) {
      form.setFieldValue('slug', slugify(name));
    }
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      message.error('Geolocalização não disponível neste dispositivo.');
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
        message.success('Coordenadas preenchidas com a sua localização atual.');
      },
      () => {
        setLocating(false);
        message.error('Não foi possível obter a localização. Verifique as permissões.');
      },
      { enableHighAccuracy: true, timeout: 15000 },
    );
  };

  const geocodeAddress = async () => {
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

    try {
      const result = await condominiumsApi.geocode(address);
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
    } catch (error) {
      message.error(
        error instanceof ApiError
          ? error.message
          : 'Não foi possível localizar o endereço. Tente ser mais específico.',
      );
    } finally {
      setGeocoding(false);
    }
  };

  const handleSubmit = (values: FormValues) => {
    const unitNumbers = parseUnitNumbers(values.unitNumbers);

    if (!isSystemOwner && plan === 'lite' && unitNumbers.length > LITE_MAX_UNITS) {
      setUnitUpgradeOpen(true);
      return;
    }

    const address = formatCondoAddress(values).trim() || values.address.trim();

    updateCondo.mutate(
      {
        id: condominium.id,
        payload: {
          name: values.name.trim(),
          slug: slugify(values.slug),
          unitNumbers,
          buildingHandoverDate: values.buildingHandoverDate
            ? values.buildingHandoverDate.format(DATE_FORMAT)
            : null,
          address,
          latitude: values.latitude,
          longitude: values.longitude,
          geofenceRadiusMeters: values.geofenceRadiusMeters,
        },
      },
      {
        onSuccess: () => message.success('Dados do condomínio salvos.'),
        onError: (error: unknown) => {
          if (error instanceof ApiError && error.code === 'PLAN_UNIT_LIMIT') {
            setUnitUpgradeOpen(true);
            return;
          }

          message.error(
            error instanceof ApiError
              ? error.message
              : 'Não foi possível salvar os dados do condomínio.',
          );
        },
      },
    );
  };

  const watchedSlug = Form.useWatch('slug', form);

  return (
    <>
      <PageHeading
        title="Dados do condomínio"
        description="Nome, unidades, entrega do prédio e localização usados na gestão e no ponto eletrônico."
      />

      <S.Card>
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          onFinish={handleSubmit}
          disabled={updateCondo.isPending}
        >
          <S.Section>
            <S.SectionTitle>Identidade</S.SectionTitle>
            <S.SectionHint>
              Como o condomínio aparece no app e no link público dos moradores.
            </S.SectionHint>

            <Form.Item
              name="name"
              label="Nome do condomínio"
              rules={[rules.required(), rules.text(3, 150)]}
            >
              <Input
                prefix={<Building2 size={16} />}
                placeholder="Residencial Jardins"
                onChange={(event) => handleNameChange(event.target.value)}
              />
            </Form.Item>

            <Form.Item
              name="slug"
              label="Endereço público (slug)"
              extra="Apenas letras minúsculas, números e hífen. Alterar o slug muda o link público."
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
                onChange={(event) => {
                  setSlugTouched(true);
                  form.setFieldValue('slug', event.target.value);
                }}
              />
            </Form.Item>

            {watchedSlug ? (
              <S.SlugPreview>
                Hub público: <code>/c/{slugify(String(watchedSlug))}</code>
              </S.SlugPreview>
            ) : null}

            <Form.Item name="buildingHandoverDate" label="Data de entrega do prédio">
              <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} allowClear />
            </Form.Item>
          </S.Section>

          <S.Section>
            <S.SectionTitle>Unidades</S.SectionTitle>
            <S.SectionHint>
              Catálogo de unidades do condomínio — uma por linha ou separadas por vírgula.
              {plan === 'lite' && !isSystemOwner
                ? ` Plano Lite: até ${LITE_MAX_UNITS} unidades.`
                : null}
            </S.SectionHint>

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
                rows={6}
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
          </S.Section>

          <S.Section id="localizacao">
            <S.SectionTitle>Localização</S.SectionTitle>
            <S.SectionHint>
              Endereço e raio usados no geofence do ponto eletrônico dos funcionários.
            </S.SectionHint>

            <AddressLocationFields form={form} disabled={updateCondo.isPending} />

            <Space wrap style={{ marginBottom: 16 }}>
              <Button
                icon={<MapPinned size={16} />}
                onClick={() => void geocodeAddress()}
                loading={geocoding}
              >
                Buscar coordenadas pelo endereço
              </Button>
              <Button icon={<LocateFixed size={16} />} onClick={useMyLocation} loading={locating}>
                Usar minha localização
              </Button>
            </Space>

            <S.CoordsRow>
              <Form.Item
                name="latitude"
                label="Latitude"
                rules={[rules.required('Informe a latitude')]}
                style={{ flex: 1 }}
              >
                <InputNumber style={{ width: '100%' }} step={0.0000001} />
              </Form.Item>
              <Form.Item
                name="longitude"
                label="Longitude"
                rules={[rules.required('Informe a longitude')]}
                style={{ flex: 1 }}
              >
                <InputNumber style={{ width: '100%' }} step={0.0000001} />
              </Form.Item>
            </S.CoordsRow>

            <Form.Item
              name="geofenceRadiusMeters"
              label="Raio do geofence (metros)"
              extra="O ponto só é aceito se o celular estiver dentro deste raio (50 a 2000 m)."
              rules={[rules.required()]}
            >
              <InputNumber min={50} max={2000} style={{ width: '100%' }} />
            </Form.Item>
          </S.Section>

          <S.Actions>
            <Button
              type="primary"
              htmlType="submit"
              icon={<Save size={16} />}
              loading={updateCondo.isPending}
            >
              Salvar dados
            </Button>
          </S.Actions>
        </Form>
      </S.Card>

      <PlanUpgradeModal
        open={unitUpgradeOpen}
        onClose={() => setUnitUpgradeOpen(false)}
        title="Limite de unidades do Lite"
        description={`O plano Lite inclui até ${LITE_MAX_UNITS} unidades no catálogo do condomínio. Para unidades ilimitadas, faça upgrade para o plano Prime.`}
        upgradePlanId="prime"
      />
    </>
  );
}
