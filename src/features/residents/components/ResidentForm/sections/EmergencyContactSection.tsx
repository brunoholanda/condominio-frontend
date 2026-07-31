import { Col, Form, Input, Row } from 'antd';
import { LifeBuoy } from 'lucide-react';

import { FormSection } from '@/shared/components/FormSection/FormSection';
import { maskPhone } from '@/shared/utils/masks';
import { rules } from '@/shared/utils/form-rules';

export function EmergencyContactSection() {
  return (
    <FormSection
      icon={<LifeBuoy size={18} />}
      title="Em caso de emergência"
      description="Pessoa que a portaria deve procurar caso não consiga contato com o morador."
    >
      <Row gutter={16}>
        <Col xs={24} md={14}>
          <Form.Item
            name={['emergencyContact', 'name']}
            label="Nome"
            rules={[rules.required(), rules.text(3, 150)]}
          >
            <Input placeholder="Nome e sobrenome" />
          </Form.Item>
        </Col>

        <Col xs={24} md={10}>
          <Form.Item
            name={['emergencyContact', 'phone']}
            label="Telefone/Celular"
            normalize={maskPhone}
            rules={[rules.required(), rules.phone()]}
          >
            <Input placeholder="(11) 98888-7777" inputMode="tel" />
          </Form.Item>
        </Col>
      </Row>
    </FormSection>
  );
}
