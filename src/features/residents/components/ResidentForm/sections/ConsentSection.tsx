import { Checkbox, Col, DatePicker, Form, Row } from 'antd';
import dayjs from 'dayjs';
import { ShieldCheck } from 'lucide-react';

import { FormSection } from '@/shared/components/FormSection/FormSection';
import { SignaturePad } from '@/shared/components/SignaturePad/SignaturePad';
import { rules } from '@/shared/utils/form-rules';

const CONSENT_TEXT =
  'Autorizo o uso dos dados aqui informados apenas para fins de controle e organização do condomínio.';

export function ConsentSection() {
  const form = Form.useFormInstance();
  const hasConsented = Form.useWatch('dataUsageConsent', form);

  return (
    <FormSection
      icon={<ShieldCheck size={18} />}
      title="Autorização de uso dos dados"
      description="A assinatura digital equivale à assinatura do formulário impresso."
    >
      <Row gutter={16}>
        <Col xs={24} md={16}>
          <Form.Item
            name="dataUsageConsent"
            valuePropName="checked"
            rules={[rules.accepted('É necessário autorizar o uso dos dados para concluir')]}
          >
            <Checkbox>{CONSENT_TEXT}</Checkbox>
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item name="signedAt" label="Data" rules={[rules.required()]}>
            <DatePicker format="DD/MM/YYYY" maxDate={dayjs()} style={{ width: '100%' }} />
          </Form.Item>
        </Col>

        {hasConsented ? (
          <Col xs={24}>
            <Form.Item
              name="signature"
              label="Assinatura do morador"
              rules={[rules.required('Assine no quadro para concluir o cadastro')]}
            >
              <SignaturePad />
            </Form.Item>
          </Col>
        ) : null}
      </Row>
    </FormSection>
  );
}
