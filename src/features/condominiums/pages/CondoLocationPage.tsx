import { App, Button, Form, InputNumber, Space } from 'antd';
import { LocateFixed, MapPinned, Save } from 'lucide-react';
import { useEffect, useState } from 'react';

import { condominiumsApi } from '@/features/condominiums/api/condominiums.api';
import { AddressLocationFields } from '@/features/condominiums/components/AddressLocationFields';
import { useManagerCondominium } from '@/features/condominiums/components/ManagerLayout';
import { useUpdateCondominiumMutation } from '@/features/condominiums/hooks/use-condominiums';
import {
  formatCondoAddress,
  parseCondoAddress,
} from '@/features/condominiums/model/condo-address';
import { ApiError } from '@/shared/api/api-error';
import { PageHeading } from '@/shared/components/PageHeading/PageHeading';
import { rules } from '@/shared/utils/form-rules';
import * as S from './CondoLocationPage.styles';

interface FormValues {
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

export function CondoLocationPage() {
  const condominium = useManagerCondominium();
  const { message } = App.useApp();
  const [form] = Form.useForm<FormValues>();
  const updateCondo = useUpdateCondominiumMutation();
  const [locating, setLocating] = useState(false);
  const [geocoding, setGeocoding] = useState(false);

  useEffect(() => {
    const parts = parseCondoAddress(condominium.address);

    form.setFieldsValue({
      ...parts,
      address: condominium.address ?? formatCondoAddress(parts),
      latitude: condominium.latitude ?? undefined,
      longitude: condominium.longitude ?? undefined,
      geofenceRadiusMeters: condominium.geofenceRadiusMeters ?? 100,
    });
  }, [condominium, form]);

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
    const address =
      formatCondoAddress(values).trim() || values.address.trim();

    updateCondo.mutate(
      {
        id: condominium.id,
        payload: {
          address,
          latitude: values.latitude,
          longitude: values.longitude,
          geofenceRadiusMeters: values.geofenceRadiusMeters,
        },
      },
      {
        onSuccess: () => message.success('Localização do condomínio salva.'),
        onError: (error: unknown) =>
          message.error(
            error instanceof ApiError ? error.message : 'Não foi possível salvar a localização.',
          ),
      },
    );
  };

  return (
    <>
      <PageHeading
        title="Localização"
        description="Endereço e raio usados no geofence do ponto eletrônico dos funcionários."
      />

      <S.Card>
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          onFinish={handleSubmit}
          disabled={updateCondo.isPending}
        >
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

          <S.Actions>
            <Button
              type="primary"
              htmlType="submit"
              icon={<Save size={16} />}
              loading={updateCondo.isPending}
            >
              Salvar localização
            </Button>
          </S.Actions>
        </Form>
      </S.Card>
    </>
  );
}
