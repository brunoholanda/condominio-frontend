import { Col, Form, Input, Row, Select } from 'antd';
import { PawPrint } from 'lucide-react';

import { FormSection } from '@/shared/components/FormSection/FormSection';
import { RepeatableFields } from '@/shared/components/RepeatableFields/RepeatableFields';
import { rules } from '@/shared/utils/form-rules';
import { PET_SPECIES, PET_SPECIES_LABELS } from '../../../model/resident.types';

const SPECIES_OPTIONS = PET_SPECIES.map((value) => ({ value, label: PET_SPECIES_LABELS[value] }));

export function PetsSection() {
  return (
    <FormSection
      icon={<PawPrint size={18} />}
      title="Animais de estimação"
      description="Animais que residem na unidade, para o controle de circulação nas áreas comuns."
    >
      <RepeatableFields
        name="pets"
        itemLabel="Animal"
        addLabel="Adicionar animal"
        emptyDescription="Nenhum animal informado."
      >
        {(index) => (
          <Row gutter={16}>
            <Col xs={24} sm={12} md={6}>
              <Form.Item
                name={[index, 'name']}
                label="Nome"
                rules={[rules.required(), rules.text(1, 60)]}
              >
                <Input placeholder="Rex" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Form.Item name={[index, 'species']} label="Espécie" rules={[rules.required()]}>
                <Select options={SPECIES_OPTIONS} placeholder="Selecione" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Form.Item name={[index, 'breed']} label="Raça" rules={[rules.text(2, 60)]}>
                <Input placeholder="Labrador (opcional)" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Form.Item
                name={[index, 'color']}
                label="Cor"
                rules={[rules.required(), rules.text(3, 40)]}
              >
                <Input placeholder="Caramelo" />
              </Form.Item>
            </Col>
          </Row>
        )}
      </RepeatableFields>
    </FormSection>
  );
}
