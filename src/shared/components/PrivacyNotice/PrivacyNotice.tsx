import { Button, Modal } from 'antd';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';

import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { buildPrivacyTopics, PRIVACY_NOTICE_VERSION } from '@/shared/privacy/privacy-notice';
import { mobileOverlayWidth } from '@/shared/utils/mobile-ui';
import { queries } from '@/styles/theme';
import * as S from './PrivacyNotice.styles';

interface PrivacyNoticeLinkProps {
  children?: ReactNode;
  /** Nome do condomínio controlador; sem ele, o texto usa um termo genérico. */
  condoName?: string;
}

/**
 * O aviso completo abre em diálogo em vez de página própria: o morador o lê no
 * momento de consentir, sem perder o que já digitou no formulário.
 */
export function PrivacyNoticeLink({
  children = 'Aviso de privacidade',
  condoName,
}: PrivacyNoticeLinkProps) {
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery(queries.downMd);
  const topics = useMemo(() => buildPrivacyTopics(condoName), [condoName]);
  const controller = condoName?.trim() || 'o condomínio';

  return (
    <>
      <S.Trigger type="button" onClick={() => setOpen(true)}>
        {children}
      </S.Trigger>

      <Modal
        open={open}
        title="Aviso de privacidade"
        width={mobileOverlayWidth(isMobile, 720)}
        onCancel={() => setOpen(false)}
        footer={
          <Button type="primary" onClick={() => setOpen(false)}>
            Entendi
          </Button>
        }
      >
        <S.Intro>
          Como {controller} trata os dados informados no cadastro de moradores, conforme a Lei
          Geral de Proteção de Dados (Lei 13.709/2018).
        </S.Intro>

        <S.Topics>
          {topics.map((topic) => (
            <section key={topic.title}>
              <S.TopicTitle>{topic.title}</S.TopicTitle>
              <S.TopicText>{topic.text}</S.TopicText>
            </section>
          ))}
        </S.Topics>

        <S.Version>{PRIVACY_NOTICE_VERSION}</S.Version>
      </Modal>
    </>
  );
}
