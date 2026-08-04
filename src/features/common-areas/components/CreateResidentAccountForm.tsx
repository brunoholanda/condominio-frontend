import { App, Button, Form, Input, Select, Space } from 'antd';
import { UserPlus } from 'lucide-react';

import { buildUnitOptions } from '@/features/residents/model/condo';
import { ApiError } from '@/shared/api/api-error';
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { rules } from '@/shared/utils/form-rules';
import { queries } from '@/styles/theme';
import { useCreateResidentAccountMutation } from '../hooks/use-resident-accounts';
import type { CreateResidentAccountPayload } from '../model/common-area.types';

interface CreateResidentAccountFormProps {
  condominiumId: string;
  units: string[];
}

/** Vincula uma conta (já criada em `/registro`) a uma unidade do condomínio. */
export function CreateResidentAccountForm({ condominiumId, units }: CreateResidentAccountFormProps) {
  const { message } = App.useApp();
  const isMobile = useMediaQuery(queries.downMd);
  const [form] = Form.useForm<CreateResidentAccountPayload>();
  const createAccount = useCreateResidentAccountMutation(condominiumId);

  const handleSubmit = (values: CreateResidentAccountPayload) => {
    createAccount.mutate(
      { email: values.email.trim().toLowerCase(), unitNumber: values.unitNumber },
      {
        onSuccess: () => {
          message.success('Conta vinculada à unidade.');
          form.resetFields();
        },
        onError: (error: unknown) =>
          message.error(
            error instanceof ApiError
              ? error.message
              : 'Não foi possível vincular a conta. Confirme se o e-mail já tem cadastro.',
          ),
      },
    );
  };

  return (
    <Form
      form={form}
      layout={isMobile ? 'vertical' : 'inline'}
      onFinish={handleSubmit}
      disabled={createAccount.isPending}
    >
      <Space wrap align="start" style={{ width: isMobile ? '100%' : undefined }}>
        <Form.Item name="email" rules={[rules.required(), rules.email()]} style={{ width: isMobile ? '100%' : undefined }}>
          <Input
            placeholder="e-mail do morador"
            style={{ width: isMobile ? '100%' : 260 }}
          />
        </Form.Item>

        <Form.Item
          name="unitNumber"
          rules={[rules.required('Selecione a unidade')]}
          style={{ width: isMobile ? '100%' : undefined }}
        >
          <Select
            showSearch
            options={buildUnitOptions(units)}
            optionFilterProp="label"
            placeholder="Unidade"
            style={{ width: isMobile ? '100%' : 160 }}
          />
        </Form.Item>

        <Form.Item style={{ width: isMobile ? '100%' : undefined }}>
          <Button
            type="primary"
            htmlType="submit"
            icon={<UserPlus size={16} />}
            loading={createAccount.isPending}
            block={isMobile}
          >
            Vincular
          </Button>
        </Form.Item>
      </Space>
    </Form>
  );
}
