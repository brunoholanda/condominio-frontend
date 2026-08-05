import { Form, Input, InputNumber, Modal, Switch } from 'antd';
import { useEffect } from 'react';

import { MoneyInput } from '@/shared/components/MoneyInput/MoneyInput';
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { rules } from '@/shared/utils/form-rules';
import { centsToReais, reaisToCents } from '@/shared/utils/currency';
import { mobileOverlayWidth } from '@/shared/utils/mobile-ui';
import { queries } from '@/styles/theme';
import type { CommonArea, CommonAreaPayload } from '../model/common-area.types';

interface CommonAreaFormValues {
  name: string;
  description?: string;
  rules?: string;
  cost: number | null;
  capacity: number;
  active: boolean;
  autoApprove: boolean;
  minAdvanceHours: number;
  cancelBeforeHours: number;
}

interface CommonAreaFormModalProps {
  open: boolean;
  area: CommonArea | null;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (payload: CommonAreaPayload) => void;
}

const DEFAULT_VALUES: CommonAreaFormValues = {
  name: '',
  cost: null,
  capacity: 10,
  active: true,
  autoApprove: false,
  minAdvanceHours: 24,
  cancelBeforeHours: 24,
};

export function CommonAreaFormModal({
  open,
  area,
  submitting,
  onClose,
  onSubmit,
}: CommonAreaFormModalProps) {
  const [form] = Form.useForm<CommonAreaFormValues>();
  const isMobile = useMediaQuery(queries.downMd);

  useEffect(() => {
    if (!open) {
      return;
    }

    form.setFieldsValue(
      area
        ? {
            name: area.name,
            description: area.description ?? undefined,
            rules: area.rules ?? undefined,
            cost: centsToReais(area.costCents),
            capacity: area.capacity,
            active: area.active,
            autoApprove: area.autoApprove,
            minAdvanceHours: area.minAdvanceHours,
            cancelBeforeHours: area.cancelBeforeHours,
          }
        : DEFAULT_VALUES,
    );
  }, [area, form, open]);

  const handleFinish = (values: CommonAreaFormValues) => {
    onSubmit({
      name: values.name.trim(),
      description: values.description?.trim() || null,
      rules: values.rules?.trim() || null,
      costCents: reaisToCents(values.cost ?? 0),
      capacity: values.capacity,
      active: values.active,
      autoApprove: values.autoApprove,
      minAdvanceHours: values.minAdvanceHours,
      cancelBeforeHours: values.cancelBeforeHours,
    });
  };

  return (
    <Modal
      open={open}
      title={area ? 'Editar área comum' : 'Nova área comum'}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Salvar"
      cancelText="Cancelar"
      confirmLoading={submitting}
      destroyOnHidden
      width={mobileOverlayWidth(isMobile, 620)}
    >
      <Form form={form} layout="vertical" requiredMark={false} onFinish={handleFinish}>
        <Form.Item name="name" label="Nome" rules={[rules.required(), rules.text(2, 150)]}>
          <Input placeholder="Salão de festas" />
        </Form.Item>

        <Form.Item name="description" label="Descrição (opcional)">
          <Input.TextArea rows={2} placeholder="Espaço com capacidade para 60 pessoas." />
        </Form.Item>

        <Form.Item name="rules" label="Regras de uso (opcional)">
          <Input.TextArea rows={3} placeholder="Uso até as 22h. Silêncio após esse horário." />
        </Form.Item>

        <Form.Item
          name="cost"
          label="Custo da reserva (R$)"
          extra="Deixe em branco ou 0 para reserva gratuita."
        >
          <MoneyInput min={0} />
        </Form.Item>

        <Form.Item name="capacity" label="Capacidade (pessoas)" rules={[rules.required()]}>
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="minAdvanceHours" label="Antecedência mínima para reservar (horas)">
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="cancelBeforeHours" label="Prazo mínimo para cancelar (horas)">
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="autoApprove" label="Aprovar reservas automaticamente" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item name="active" label="Área ativa (visível para reserva)" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
}
