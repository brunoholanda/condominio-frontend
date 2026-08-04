import { AutoComplete, App, Col, Form, Input, Row, Select } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { useRef, useState } from 'react';

import { condominiumsApi, type GeocodeSuggestion } from '@/features/condominiums/api/condominiums.api';
import {
  BRAZIL_STATES,
  formatCondoAddress,
  type CondoAddressParts,
} from '@/features/condominiums/model/condo-address';
import { ApiError } from '@/shared/api/api-error';
import { maskCep, onlyDigits } from '@/shared/utils/masks';
import { rules } from '@/shared/utils/form-rules';

export interface AddressLocationFormValues extends CondoAddressParts {
  address: string;
  latitude?: number;
  longitude?: number;
}

interface AddressLocationFieldsProps {
  form: FormInstance;
  disabled?: boolean;
}

function applySuggestion(form: FormInstance, item: GeocodeSuggestion, keepNumber?: string) {
  const parts: CondoAddressParts = {
    street: item.street,
    number: item.number || keepNumber,
    neighborhood: item.neighborhood,
    city: item.city,
    state: item.state,
    zipCode: item.zipCode,
  };

  form.setFieldsValue({
    ...parts,
    address: item.address || formatCondoAddress(parts),
    latitude: item.latitude || undefined,
    longitude: item.longitude || undefined,
  });
}

function syncComposedAddress(form: FormInstance) {
  const parts = form.getFieldsValue([
    'street',
    'number',
    'neighborhood',
    'city',
    'state',
    'zipCode',
  ]) as CondoAddressParts;

  form.setFieldValue('address', formatCondoAddress(parts));
}

/** Campos estruturados de endereço com autocomplete e busca por CEP. */
export function AddressLocationFields({ form, disabled }: AddressLocationFieldsProps) {
  const { message } = App.useApp();
  const [options, setOptions] = useState<{ value: string; label: string; item: GeocodeSuggestion }[]>(
    [],
  );
  const [suggesting, setSuggesting] = useState(false);
  const [lookingCep, setLookingCep] = useState(false);
  const suggestTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suggestSeq = useRef(0);
  const lastCep = useRef('');

  const runSuggest = (query: string) => {
    if (suggestTimer.current) clearTimeout(suggestTimer.current);

    const q = query.trim();

    if (q.length < 3) {
      setOptions([]);
      return;
    }

    suggestTimer.current = setTimeout(() => {
      const seq = ++suggestSeq.current;
      setSuggesting(true);

      void condominiumsApi
        .suggestAddresses(q)
        .then((items) => {
          if (seq !== suggestSeq.current) return;

          setOptions(
            items.map((item) => ({
              value: item.street || item.address || item.displayName,
              label: item.address || item.displayName,
              item,
            })),
          );
        })
        .catch(() => {
          if (seq !== suggestSeq.current) return;
          setOptions([]);
        })
        .finally(() => {
          if (seq === suggestSeq.current) setSuggesting(false);
        });
    }, 400);
  };

  const lookupCep = async (maskedOrRaw: string) => {
    const digits = onlyDigits(maskedOrRaw);

    if (digits.length !== 8 || digits === lastCep.current) return;

    lastCep.current = digits;
    setLookingCep(true);

    try {
      const result = await condominiumsApi.lookupCep(digits);
      const currentNumber = String(form.getFieldValue('number') ?? '');

      applySuggestion(form, result, currentNumber || undefined);
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

  return (
    <>
      <Form.Item name="address" hidden rules={[rules.required(), rules.text(5, 255)]}>
        <Input />
      </Form.Item>

      <Row gutter={12}>
        <Col xs={24} sm={8}>
          <Form.Item
            name="zipCode"
            label="CEP"
            rules={[
              rules.required('Informe o CEP'),
              {
                validator: async (_, value: string) => {
                  if (!value || onlyDigits(value).length === 8) return;
                  throw new Error('CEP inválido');
                },
              },
            ]}
            normalize={maskCep}
            extra={lookingCep ? 'Buscando endereço…' : 'Ao completar o CEP, o endereço é preenchido.'}
          >
            <Input
              placeholder="00000-000"
              inputMode="numeric"
              disabled={disabled || lookingCep}
              onChange={(event) => {
                const digits = onlyDigits(event.target.value);
                if (digits.length < 8) lastCep.current = '';
                if (digits.length === 8) void lookupCep(digits);
              }}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={16}>
          <Form.Item
            name="street"
            label="Rua / logradouro"
            rules={[rules.required('Informe a rua'), rules.text(2, 120)]}
            extra="Digite para ver sugestões de endereço."
          >
            <AutoComplete
              options={options}
              onSearch={(value) => {
                runSuggest(value);
                queueMicrotask(() => syncComposedAddress(form));
              }}
              onSelect={(_, option) => {
                const item = (option as { item?: GeocodeSuggestion }).item;
                if (!item) return;
                setOptions([]);
                // AutoComplete grava o `value` da opção no campo; reaplica as partes estruturadas em seguida.
                setTimeout(() => {
                  const currentNumber = String(form.getFieldValue('number') ?? '');
                  applySuggestion(form, item, currentNumber || undefined);
                }, 0);
              }}
              disabled={disabled}
              notFoundContent={suggesting ? 'Buscando…' : null}
            >
              <Input placeholder="Comece a digitar a rua, bairro ou cidade" allowClear />
            </AutoComplete>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={12}>
        <Col xs={24} sm={8}>
          <Form.Item
            name="number"
            label="Número"
            rules={[rules.required('Informe o número'), rules.text(1, 20)]}
          >
            <Input
              placeholder="100"
              disabled={disabled}
              onChange={() => {
                queueMicrotask(() => syncComposedAddress(form));
              }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={16}>
          <Form.Item
            name="neighborhood"
            label="Bairro"
            rules={[rules.required('Informe o bairro'), rules.text(2, 80)]}
          >
            <Input
              placeholder="Centro"
              disabled={disabled}
              onChange={() => {
                queueMicrotask(() => syncComposedAddress(form));
              }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={12}>
        <Col xs={24} sm={14}>
          <Form.Item
            name="city"
            label="Cidade"
            rules={[rules.required('Informe a cidade'), rules.text(2, 80)]}
          >
            <Input
              placeholder="Campinas"
              disabled={disabled}
              onChange={() => {
                queueMicrotask(() => syncComposedAddress(form));
              }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={10}>
          <Form.Item name="state" label="Estado" rules={[rules.required('Informe o estado')]}>
            <Select
              options={[...BRAZIL_STATES]}
              placeholder="UF"
              showSearch
              optionFilterProp="label"
              disabled={disabled}
              onChange={() => {
                queueMicrotask(() => syncComposedAddress(form));
              }}
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
}
