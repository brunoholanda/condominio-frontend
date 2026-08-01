import { Col, Form, Input, Row, Select } from 'antd';
import { Users } from 'lucide-react';

import { FormSection } from '@/shared/components/FormSection/FormSection';
import { RepeatableFields } from '@/shared/components/RepeatableFields/RepeatableFields';
import { maskRg } from '@/shared/utils/masks';
import { rules } from '@/shared/utils/form-rules';
import { KINSHIP_OPTIONS, OTHER_KINSHIP } from '../../../model/kinship';

const KINSHIP_SELECT_OPTIONS = KINSHIP_OPTIONS.map((value) => ({ value, label: value }));

interface HouseholdMemberFieldsProps {
  /** Index of the row inside the `householdMembers` list. */
  index: number;
}

function HouseholdMemberFields({ index }: HouseholdMemberFieldsProps) {
  const form = Form.useFormInstance();
  const kinship = Form.useWatch(['householdMembers', index, 'kinship'], form);

  return (
    <Row gutter={16}>
      <Col xs={24} md={10}>
        <Form.Item
          name={[index, 'fullName']}
          label="Nome e sobrenome"
          rules={[rules.required(), rules.text(3, 150)]}
        >
          <Input placeholder="Nome completo" />
        </Form.Item>
      </Col>

      <Col xs={24} sm={12} md={7}>
        <Form.Item
          name={[index, 'rg']}
          label="RG"
          normalize={maskRg}
          rules={[rules.required(), rules.text(5, 20)]}
        >
          <Input placeholder="12.345.678-9" inputMode="numeric" />
        </Form.Item>
      </Col>

      <Col xs={24} sm={12} md={7}>
        <Form.Item
          name={[index, 'kinship']}
          label="Grau de parentesco"
          rules={[rules.required('Selecione o grau de parentesco')]}
        >
          <Select showSearch options={KINSHIP_SELECT_OPTIONS} placeholder="Selecione" />
        </Form.Item>
      </Col>

      {kinship === OTHER_KINSHIP ? (
        <Col xs={24} md={10}>
          <Form.Item
            name={[index, 'kinshipOther']}
            label="Qual o parentesco?"
            rules={[rules.required(), rules.text(2, 60)]}
          >
            <Input placeholder="Descreva o vínculo com o titular" />
          </Form.Item>
        </Col>
      ) : null}
    </Row>
  );
}

export function HouseholdMembersSection() {
  return (
    <FormSection
      icon={<Users size={18} />}
      title="Demais moradores da unidade"
      description="Informe aqui todas as pessoas que moram no apartamento além de você — elas não preenchem outro formulário. Avise cada uma de que os dados ficam no cadastro do condomínio."
    >
      <RepeatableFields
        name="householdMembers"
        itemLabel="Morador"
        addLabel="Adicionar morador"
        emptyDescription="Nenhum outro morador informado."
      >
        {(index) => <HouseholdMemberFields index={index} />}
      </RepeatableFields>
    </FormSection>
  );
}
