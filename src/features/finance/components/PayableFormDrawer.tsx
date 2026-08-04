import { Button, DatePicker, Drawer, Form, Input } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { Save } from 'lucide-react';
import { useEffect } from 'react';

import { MoneyInput } from '@/shared/components/MoneyInput/MoneyInput';
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { centsToReais, reaisToCents } from '@/shared/utils/currency';
import { rules } from '@/shared/utils/form-rules';
import { mobileOverlayWidth } from '@/shared/utils/mobile-ui';
import { queries } from '@/styles/theme';
import type { Payable, PayablePayload } from '../model/finance.types';

interface PayableFormValues {
  description: string;
  vendor: string;
  category: string;
  amount: number;
  dueDate: Dayjs;
  notes?: string;
}

interface PayableFormDrawerProps {
  open: boolean;
  payable: Payable | null;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (payload: PayablePayload) => void;
}

const DATE_FORMAT = 'YYYY-MM-DD';

export function PayableFormDrawer({
  open,
  payable,
  submitting,
  onClose,
  onSubmit,
}: PayableFormDrawerProps) {
  const [form] = Form.useForm<PayableFormValues>();
  const isMobile = useMediaQuery(queries.downMd);

  useEffect(() => {
    if (!open) {
      return;
    }

    form.setFieldsValue(
      payable
        ? {
            description: payable.description,
            vendor: payable.vendor,
            category: payable.category,
            amount: centsToReais(payable.amountCents),
            dueDate: dayjs(payable.dueDate),
            notes: payable.notes ?? undefined,
          }
        : { amount: 0 },
    );
  }, [form, open, payable]);

  const handleFinish = (values: PayableFormValues) => {
    onSubmit({
      description: values.description.trim(),
      vendor: values.vendor.trim(),
      category: values.category.trim(),
      amountCents: reaisToCents(values.amount),
      dueDate: values.dueDate.format(DATE_FORMAT),
      notes: values.notes?.trim() || null,
    });
  };

  return (
    <Drawer
      open={open}
      title={payable ? 'Editar conta a pagar' : 'Nova conta a pagar'}
      placement={isMobile ? 'bottom' : 'right'}
      height={isMobile ? '90vh' : undefined}
      width={mobileOverlayWidth(isMobile, 480)}
      onClose={onClose}
      extra={
        <Button type="primary" icon={<Save size={16} />} loading={submitting} onClick={() => form.submit()}>
          Salvar
        </Button>
      }
    >
      <Form form={form} layout="vertical" requiredMark={false} onFinish={handleFinish}>
        <Form.Item
          name="description"
          label="Descrição"
          rules={[rules.required(), rules.text(3, 200)]}
        >
          <Input placeholder="Manutenção do elevador social" />
        </Form.Item>

        <Form.Item name="vendor" label="Fornecedor" rules={[rules.required(), rules.text(2, 150)]}>
          <Input placeholder="Elevadores Ápice Ltda." />
        </Form.Item>

        <Form.Item name="category" label="Categoria" rules={[rules.required(), rules.text(2, 60)]}>
          <Input placeholder="Manutenção" />
        </Form.Item>

        <Form.Item name="amount" label="Valor (R$)" rules={[rules.required()]}>
          <MoneyInput min={0.01} />
        </Form.Item>

        <Form.Item name="dueDate" label="Vencimento" rules={[rules.required()]}>
          <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="notes" label="Observações (opcional)">
          <Input.TextArea rows={3} placeholder="Referente à visita de julho." />
        </Form.Item>
      </Form>
    </Drawer>
  );
}
