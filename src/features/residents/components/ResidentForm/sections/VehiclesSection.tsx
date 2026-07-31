import { Col, Form, Input, Row } from 'antd';
import { Car } from 'lucide-react';

import { FormSection } from '@/shared/components/FormSection/FormSection';
import { RepeatableFields } from '@/shared/components/RepeatableFields/RepeatableFields';
import { maskPlate } from '@/shared/utils/masks';
import { rules } from '@/shared/utils/form-rules';

export function VehiclesSection() {
  return (
    <FormSection
      icon={<Car size={18} />}
      title="Veículos da unidade"
      description="Carros, motos e demais veículos autorizados a acessar a garagem."
    >
      <RepeatableFields
        name="vehicles"
        itemLabel="Veículo"
        addLabel="Adicionar veículo"
        emptyDescription="Nenhum veículo informado."
      >
        {(index) => (
          <Row gutter={16}>
            <Col xs={24} sm={12} md={6}>
              <Form.Item
                name={[index, 'brand']}
                label="Marca"
                rules={[rules.required(), rules.text(2, 60)]}
              >
                <Input placeholder="Volkswagen" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Form.Item
                name={[index, 'model']}
                label="Modelo"
                rules={[rules.required(), rules.text(1, 60)]}
              >
                <Input placeholder="Polo" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Form.Item
                name={[index, 'color']}
                label="Cor"
                rules={[rules.required(), rules.text(3, 40)]}
              >
                <Input placeholder="Prata" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Form.Item
                name={[index, 'plate']}
                label="Placa"
                normalize={maskPlate}
                rules={[rules.required(), rules.plate()]}
              >
                <Input placeholder="ABC-1D23" />
              </Form.Item>
            </Col>
          </Row>
        )}
      </RepeatableFields>
    </FormSection>
  );
}
