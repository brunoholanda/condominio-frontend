import { Checkbox, Col, Form, Input, Row } from 'antd';
import dayjs from 'dayjs';
import { CalendarClock, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';

import { FormSection } from '@/shared/components/FormSection/FormSection';
import { PrivacyNoticeLink } from '@/shared/components/PrivacyNotice/PrivacyNotice';
import { SignaturePad } from '@/shared/components/SignaturePad/SignaturePad';
import { CONSENT_TEXT } from '@/shared/privacy/privacy-notice';
import { rules } from '@/shared/utils/form-rules';

const STAMP_FORMAT = 'DD/MM/YYYY [às] HH:mm';
const CLOCK_REFRESH_MS = 30_000;

/**
 * Read-only stamp of when the form was signed. New registrations show the
 * current time and are dated by the API on submit, so there is nothing to edit.
 */
function SignedAtStamp() {
  const form = Form.useFormInstance();
  const signedAt = Form.useWatch('signedAt', form);
  const [now, setNow] = useState(() => dayjs());

  useEffect(() => {
    if (signedAt) {
      return;
    }

    const timer = window.setInterval(() => setNow(dayjs()), CLOCK_REFRESH_MS);

    return () => window.clearInterval(timer);
  }, [signedAt]);

  return (
    <Form.Item label="Data e hora da assinatura" required extra="Registrada automaticamente.">
      <Input
        readOnly
        tabIndex={-1}
        variant="filled"
        prefix={<CalendarClock size={15} />}
        value={(signedAt ?? now).format(STAMP_FORMAT)}
      />
    </Form.Item>
  );
}

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
            extra={
              <>
                Leia o <PrivacyNoticeLink /> antes de autorizar. A autorização pode ser revogada a
                qualquer momento junto à administração.
              </>
            }
          >
            <Checkbox>{CONSENT_TEXT}</Checkbox>
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <SignedAtStamp />
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
