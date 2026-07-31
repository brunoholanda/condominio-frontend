import { App, Button, Form } from 'antd';
import { RotateCcw, Save } from 'lucide-react';

import type { ResidentFormValues } from '../../model/resident-form.types';
import { emptyResidentFormValues } from '../../model/resident-form.mapper';
import * as S from './ResidentForm.styles';
import { ConsentSection } from './sections/ConsentSection';
import { EmergencyContactSection } from './sections/EmergencyContactSection';
import { EmployeesSection } from './sections/EmployeesSection';
import { HouseholdMembersSection } from './sections/HouseholdMembersSection';
import { IdentificationSection } from './sections/IdentificationSection';
import { LandlordSection } from './sections/LandlordSection';
import { PetsSection } from './sections/PetsSection';
import { VehiclesSection } from './sections/VehiclesSection';

interface ResidentFormProps {
  initialValues?: ResidentFormValues;
  submitting: boolean;
  submitLabel: string;
  onSubmit: (values: ResidentFormValues) => void;
}

export function ResidentForm({
  initialValues,
  submitting,
  submitLabel,
  onSubmit,
}: ResidentFormProps) {
  const [form] = Form.useForm<ResidentFormValues>();
  const { modal } = App.useApp();
  const occupancyType = Form.useWatch('occupancyType', form);

  const confirmReset = () => {
    modal.confirm({
      title: 'Limpar formulário?',
      content: 'Você tem certeza que deseja limpar? Todos os dados digitados serão perdidos.',
      okText: 'Sim, limpar',
      cancelText: 'Cancelar',
      okButtonProps: { danger: true },
      onOk: () => form.resetFields(),
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      requiredMark="optional"
      scrollToFirstError
      initialValues={initialValues ?? emptyResidentFormValues}
      onFinish={onSubmit}
      disabled={submitting}
    >
      <S.Sections>
        <IdentificationSection />
        <EmergencyContactSection />
        {occupancyType === 'TENANT' ? <LandlordSection /> : null}
        <HouseholdMembersSection />
        <EmployeesSection />
        <VehiclesSection />
        <PetsSection />
        <ConsentSection />
      </S.Sections>

      <S.Actions>
        <Button icon={<RotateCcw size={16} />} onClick={confirmReset}>
          Limpar
        </Button>
        <Button type="primary" htmlType="submit" icon={<Save size={16} />} loading={submitting}>
          {submitLabel}
        </Button>
      </S.Actions>
    </Form>
  );
}
