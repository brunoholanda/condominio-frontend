import { Col, Form, Input, Row } from 'antd';
import { Briefcase } from 'lucide-react';

import { FormSection } from '@/shared/components/FormSection/FormSection';
import { RepeatableFields } from '@/shared/components/RepeatableFields/RepeatableFields';
import { maskRg } from '@/shared/utils/masks';
import { rules } from '@/shared/utils/form-rules';

export function EmployeesSection() {
  return (
    <FormSection
      icon={<Briefcase size={18} />}
      title="Funcionário(s) da unidade"
      description="Profissionais que prestam serviço no apartamento. Informe apenas quem realmente trabalha na unidade e avise cada um sobre o cadastro."
    >
      <RepeatableFields
        name="employees"
        itemLabel="Funcionário"
        addLabel="Adicionar funcionário"
        emptyDescription="Nenhum funcionário informado."
      >
        {(index) => (
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name={[index, 'fullName']}
                label="Nome e sobrenome"
                rules={[rules.required(), rules.text(3, 150)]}
              >
                <Input placeholder="Nome completo" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={5}>
              <Form.Item
                name={[index, 'rg']}
                label="RG"
                normalize={maskRg}
                rules={[rules.required(), rules.text(5, 20)]}
              >
                <Input placeholder="12.345.678-9" inputMode="numeric" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={5}>
              <Form.Item
                name={[index, 'role']}
                label="Cargo"
                rules={[rules.required(), rules.text(2, 60)]}
              >
                <Input placeholder="Diarista, babá..." />
              </Form.Item>
            </Col>

            <Col xs={24} md={6}>
              <Form.Item
                name={[index, 'workSchedule']}
                label="Expediente"
                rules={[rules.required(), rules.text(2, 60)]}
              >
                <Input placeholder="Seg. e qua., 8h às 17h" />
              </Form.Item>
            </Col>
          </Row>
        )}
      </RepeatableFields>
    </FormSection>
  );
}
