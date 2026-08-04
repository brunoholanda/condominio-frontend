import { Result, Skeleton } from 'antd';
import {
  Building2,
  CalendarCheck,
  Clock3,
  FileText,
  Landmark,
  MessageSquareText,
  Phone,
  ShieldCheck,
  UserRound,
  UserPlus,
} from 'lucide-react';
import type { ComponentType } from 'react';
import { useParams } from 'react-router-dom';

import { usePublicContactsQuery } from '@/features/directory/hooks/use-contacts';
import type { ContactCategory } from '@/features/directory/model/contact.types';
import { CONTACT_CATEGORY_LABELS } from '@/features/directory/model/contact.types';
import { onlyDigits, maskPhone } from '@/shared/utils/masks';
import { usePublicCondominiumQuery } from '../hooks/use-condominiums';
import type { PublicHubLink } from '../model/public-qr.types';
import { PUBLIC_HUB_LINK_HINTS, PUBLIC_HUB_LINK_LABELS } from '../model/public-qr.types';
import * as S from './PublicCondoHubPage.styles';

const CATEGORY_ICONS: Record<ContactCategory, typeof Phone> = {
  DOORMAN: ShieldCheck,
  SYNDIC: UserRound,
  ADMIN: Building2,
  CUSTOM: Phone,
};

const SERVICE_ICONS: Record<PublicHubLink, ComponentType<{ size?: number }>> = {
  cadastro: UserPlus,
  documentos: FileText,
  transparencia: Landmark,
  sugestoes: MessageSquareText,
  reservas: CalendarCheck,
  ponto: Clock3,
};

function contactHref(contact: { phone: string | null; url: string | null }): string | undefined {
  if (contact.url) {
    return contact.url;
  }

  if (contact.phone) {
    const digits = onlyDigits(contact.phone);

    return `tel:+55${digits}`;
  }

  return undefined;
}

/** Linktree público do condomínio: contatos e atalhos para os serviços aos moradores. */
export function PublicCondoHubPage() {
  const { slug } = useParams<{ slug: string }>();
  const condominiumQuery = usePublicCondominiumQuery(slug);
  const contactsQuery = usePublicContactsQuery(slug);

  if (condominiumQuery.isError) {
    return (
      <Result
        status="404"
        title="Condomínio não encontrado"
        subTitle="Verifique se o endereço digitado está correto."
      />
    );
  }

  if (condominiumQuery.isLoading || !condominiumQuery.data) {
    return <Skeleton active avatar paragraph={{ rows: 6 }} />;
  }

  const condominium = condominiumQuery.data;
  const contacts = contactsQuery.data ?? [];
  const serviceLinks = condominium.publicHubLinks ?? [];

  return (
    <S.Wrapper>
      <S.Icon aria-hidden>
        <Building2 size={32} />
      </S.Icon>

      <div>
        <S.Name>{condominium.name}</S.Name>
        <S.Subtitle>Bem-vindo(a)! Escolha o que você precisa:</S.Subtitle>
      </div>

      {contacts.length > 0 ? (
        <S.Section>
          <S.SectionTitle>Contatos úteis</S.SectionTitle>
          {contacts.map((contact) => {
            const Icon = CATEGORY_ICONS[contact.category];
            const href = contactHref(contact);

            return (
              <S.LinkButton
                key={contact.id}
                href={href}
                target={contact.url ? '_blank' : undefined}
                rel={contact.url ? 'noreferrer' : undefined}
              >
                <S.LinkIcon aria-hidden>
                  <Icon size={18} />
                </S.LinkIcon>
                <S.LinkText>
                  {contact.label}
                  <S.LinkCategory>{CONTACT_CATEGORY_LABELS[contact.category]}</S.LinkCategory>
                  {contact.phone ? <S.LinkSubtitle>{maskPhone(contact.phone)}</S.LinkSubtitle> : null}
                </S.LinkText>
              </S.LinkButton>
            );
          })}
        </S.Section>
      ) : null}

      {serviceLinks.length > 0 ? (
        <S.Section>
          <S.SectionTitle>Serviços aos moradores</S.SectionTitle>

          {serviceLinks.map((link) => {
            const Icon = SERVICE_ICONS[link];

            return (
              <S.LinkButton key={link} href={`/c/${slug}/${link}`}>
                <S.LinkIcon aria-hidden>
                  <Icon size={18} />
                </S.LinkIcon>
                <S.LinkText>
                  {PUBLIC_HUB_LINK_LABELS[link]}
                  <S.LinkSubtitle>{PUBLIC_HUB_LINK_HINTS[link]}</S.LinkSubtitle>
                </S.LinkText>
              </S.LinkButton>
            );
          })}
        </S.Section>
      ) : null}
    </S.Wrapper>
  );
}
