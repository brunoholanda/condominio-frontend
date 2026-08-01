import { ShieldAlert } from 'lucide-react';

import { PrivacyNoticeLink } from '@/shared/components/PrivacyNotice/PrivacyNotice';
import { OPERATOR_REMINDER } from '@/shared/privacy/operator-duties';
import * as S from './DataProtectionNotice.styles';

/** Lembrete fixo nas telas da área restrita, onde o cadastro fica exposto. */
export function DataProtectionNotice() {
  return (
    <S.Notice
      type="warning"
      showIcon
      icon={<ShieldAlert size={18} />}
      message="Dados pessoais sob a sua responsabilidade"
      description={
        <>
          {OPERATOR_REMINDER} <PrivacyNoticeLink>Ver o aviso de privacidade</PrivacyNoticeLink>.
        </>
      }
    />
  );
}
