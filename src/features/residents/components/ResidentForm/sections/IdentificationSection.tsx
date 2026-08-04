import { Checkbox, Col, DatePicker, Form, Input, Radio, Row, Select } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { IdCard } from 'lucide-react';

import { FormSection } from '@/shared/components/FormSection/FormSection';
import { PhoneInput } from '@/shared/components/PhoneInput/PhoneInput';
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { maskCpf, maskPhone, maskRg, upperCase } from '@/shared/utils/masks';
import { rules } from '@/shared/utils/form-rules';
import { queries } from '@/styles/theme';
import { buildUnitOptions } from '../../../model/condo';
import { OCCUPANCY_TYPE_LABELS, OCCUPANCY_TYPES } from '../../../model/resident.types';

const OCCUPANCY_OPTIONS = OCCUPANCY_TYPES.map((value) => ({
  value,
  label: OCCUPANCY_TYPE_LABELS[value],
}));

interface IdentificationSectionProps {
  units: string[];
  /** Data de entrega do prédio, quando o condomínio informou uma. */
  buildingHandoverDate?: Dayjs | null;
}

export function IdentificationSection({ units, buildingHandoverDate }: IdentificationSectionProps) {
  const form = Form.useFormInstance();
  const isMobile = useMediaQuery(queries.downMd);
  const movedInAt = Form.useWatch<Dayjs | undefined>('movedInAt', form);
  const unitOptions = buildUnitOptions(units);
  // The shortcut is not a field of its own: it simply reflects the date below.
  const sinceHandover = Boolean(
    buildingHandoverDate && movedInAt?.isSame(buildingHandoverDate, 'day'),
  );

  const handleSinceHandover = (checked: boolean) => {
    form.setFieldValue('movedInAt', checked ? buildingHandoverDate : undefined);

    // Clearing the date leaves the field pending, not wrong: only the filled
    // date is worth validating right away, to drop an error already on screen.
    if (checked) {
      void form.validateFields(['movedInAt']);
    }
  };

  return (
    <FormSection
      icon={<IdCard size={18} />}
      title="Identificação do morador"
      description="Dados de quem está preenchendo o formulário em nome da unidade. Os demais moradores entram mais adiante, na seção “Demais moradores da unidade”."
    >
      <Row gutter={16}>
        <Col xs={24} sm={8} md={6}>
          <Form.Item
            name="unit"
            label="Unidade/Apartamento"
            rules={[rules.required('Selecione a unidade do morador')]}
          >
            <Select
              showSearch
              options={unitOptions}
              placeholder="Selecione"
              optionFilterProp="label"
              notFoundContent="Unidade inexistente no condomínio"
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={16} md={10}>
          <Form.Item
            name="occupancyType"
            label="Vínculo com a unidade"
            rules={[rules.required('Selecione se o morador é proprietário ou inquilino')]}
          >
            <Radio.Group
              options={OCCUPANCY_OPTIONS}
              optionType="button"
              buttonStyle="solid"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                width: isMobile ? '100%' : undefined,
              }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} md={16}>
          <Form.Item
            name="fullName"
            label="Nome completo"
            normalize={upperCase}
            rules={[rules.required(), rules.text(3, 150)]}
          >
            <Input placeholder="Nome e sobrenome" autoComplete="name" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Form.Item
            name="rg"
            label="RG"
            normalize={maskRg}
            rules={[rules.required(), rules.text(5, 20)]}
          >
            <Input placeholder="12.345.678-9" inputMode="numeric" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} sm={12} md={8}>
          <Form.Item name="cpf" label="CPF" normalize={maskCpf} rules={[rules.required(), rules.cpf()]}>
            <Input placeholder="000.000.000-00" inputMode="numeric" />
          </Form.Item>
        </Col>

        <Col xs={24} md={16}>
          <Form.Item name="email" label="E-mail" rules={[rules.required(), rules.email()]}>
            <Input placeholder="nome@exemplo.com.br" autoComplete="email" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} sm={12} md={8}>
          <Form.Item name="landlinePhone" label="Telefone" normalize={maskPhone} rules={[rules.phone()]}>
            <PhoneInput placeholder="(11) 3333-4444" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Form.Item
            name="mobilePhone"
            label="Celular"
            normalize={maskPhone}
            rules={[rules.required(), rules.phone()]}
          >
            <PhoneInput />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Form.Item
            name="movedInAt"
            label="Quando mudou-se"
            rules={[rules.required()]}
            extra={
              buildingHandoverDate ? (
                <Checkbox
                  checked={sinceHandover}
                  onChange={(event) => handleSinceHandover(event.target.checked)}
                >
                  Desde a entrega do prédio
                </Checkbox>
              ) : undefined
            }
          >
            <DatePicker
              format="DD/MM/YYYY"
              placeholder="Selecione a data"
              minDate={buildingHandoverDate ?? undefined}
              maxDate={dayjs()}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
      </Row>
    </FormSection>
  );
}
