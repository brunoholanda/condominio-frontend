import { Col, Form, Input, Row } from 'antd';
import { KeyRound } from 'lucide-react';

import { FormSection } from '@/shared/components/FormSection/FormSection';
import { maskPhone, upperCase } from '@/shared/utils/masks';
import { rules } from '@/shared/utils/form-rules';

/** Only rendered for tenants: the condominium must know who owns the unit. */
export function LandlordSection() {
  return (
    <FormSection
      icon={<KeyRound size={18} />}
      title="Em caso de locatário"
      description="Proprietário do imóvel ou administradora responsável pela locação."
    >
      <Row gutter={16}>
        <Col xs={24} md={14}>
          <Form.Item
            name={['landlord', 'name']}
            label="Proprietário/Administradora"
            normalize={upperCase}
            rules={[rules.required(), rules.text(3, 150)]}
          >
            <Input placeholder="Nome do proprietário ou da administradora" />
          </Form.Item>
        </Col>

        <Col xs={24} md={10}>
          <Form.Item
            name={['landlord', 'phone']}
            label="Telefone"
            normalize={maskPhone}
            rules={[rules.required(), rules.phone()]}
          >
            <Input placeholder="(11) 3333-4444" inputMode="tel" />
          </Form.Item>
        </Col>
      </Row>
    </FormSection>
  );
}
