import { App, Button, Form } from 'antd';
import type { Dayjs } from 'dayjs';
import { RotateCcw, Save } from 'lucide-react';

import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { mobileOverlayWidth } from '@/shared/utils/mobile-ui';
import { queries } from '@/styles/theme';
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
  /** Unidades existentes no condomínio, para o `Select` da unidade. */
  units: string[];
  buildingHandoverDate?: Dayjs | null;
  /** Nome do condomínio, usado nos textos de privacidade quando disponível. */
  condoName?: string;
  initialValues?: ResidentFormValues;
  submitting: boolean;
  submitLabel: string;
  onSubmit: (values: ResidentFormValues) => void;
}

export function ResidentForm({
  units,
  buildingHandoverDate,
  condoName,
  initialValues,
  submitting,
  submitLabel,
  onSubmit,
}: ResidentFormProps) {
  const [form] = Form.useForm<ResidentFormValues>();
  const { modal } = App.useApp();
  const isMobile = useMediaQuery(queries.downMd);
  const occupancyType = Form.useWatch('occupancyType', form);

  /**
   * Última conferência da unidade: é o campo que amarra a ficha ao apartamento,
   * só aceita um formulário por número e não dá para trocar depois sem passar
   * pela administração.
   */
  const confirmUnit = (values: ResidentFormValues) => {
    modal.confirm({
      title: 'Confirme a unidade do cadastro',
      okText: submitLabel,
      cancelText: 'Revisar',
      width: mobileOverlayWidth(isMobile, 460),
      content: (
        <>
          <S.ConfirmedUnit>{values.unit}</S.ConfirmedUnit>
          Confira o número do apartamento antes de continuar. Cada unidade tem um único formulário,
          que vale para todos os moradores informados aqui.
        </>
      ),
      onOk: () => onSubmit(values),
    });
  };

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
      onFinish={confirmUnit}
      disabled={submitting}
    >
      <S.Sections>
        <IdentificationSection units={units} buildingHandoverDate={buildingHandoverDate} />
        <EmergencyContactSection />
        {occupancyType === 'TENANT' ? <LandlordSection /> : null}
        <HouseholdMembersSection />
        <EmployeesSection />
        <VehiclesSection />
        <PetsSection />
        <ConsentSection condoName={condoName} />
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
