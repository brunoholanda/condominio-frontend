import { Button, Modal } from 'antd';
import type { ReactNode } from 'react';
import { useState } from 'react';

import {
  DATA_CONTROLLER,
  PRIVACY_NOTICE_VERSION,
  PRIVACY_TOPICS,
} from '@/shared/privacy/privacy-notice';
import * as S from './PrivacyNotice.styles';

interface PrivacyNoticeLinkProps {
  children?: ReactNode;
}

/**
 * O aviso completo abre em diálogo em vez de página própria: o morador o lê no
 * momento de consentir, sem perder o que já digitou no formulário.
 */
export function PrivacyNoticeLink({ children = 'Aviso de privacidade' }: PrivacyNoticeLinkProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <S.Trigger type="button" onClick={() => setOpen(true)}>
        {children}
      </S.Trigger>

      <Modal
        open={open}
        title="Aviso de privacidade"
        width={720}
        onCancel={() => setOpen(false)}
        footer={
          <Button type="primary" onClick={() => setOpen(false)}>
            Entendi
          </Button>
        }
      >
        <S.Intro>
          Como o {DATA_CONTROLLER} trata os dados informados no cadastro de moradores, conforme a
          Lei Geral de Proteção de Dados (Lei 13.709/2018).
        </S.Intro>

        <S.Topics>
          {PRIVACY_TOPICS.map((topic) => (
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
