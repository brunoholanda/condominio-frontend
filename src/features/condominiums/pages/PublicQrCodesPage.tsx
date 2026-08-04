import { App, Button, Switch } from 'antd';
import {
  CalendarCheck,
  Clock3,
  Download,
  ExternalLink,
  FileText,
  Landmark,
  MessageSquareText,
  QrCode,
  UserPlus,
} from 'lucide-react';
import type { ComponentType } from 'react';

import { ApiError } from '@/shared/api/api-error';
import { PageHeading } from '@/shared/components/PageHeading/PageHeading';
import { useManagerCondominium } from '../components/ManagerLayout';
import {
  useDownloadPublicQrMutation,
  useUpdateCondominiumMutation,
} from '../hooks/use-condominiums';
import type { PublicHubLink } from '../model/public-qr.types';
import {
  PUBLIC_HUB_LINKS,
  PUBLIC_HUB_LINK_HINTS,
  PUBLIC_HUB_LINK_LABELS,
  PUBLIC_QR_TARGETS,
  PUBLIC_QR_TARGET_HINTS,
  PUBLIC_QR_TARGET_LABELS,
  publicPathForTarget,
  type PublicQrTarget,
} from '../model/public-qr.types';
import * as S from './PublicQrCodesPage.styles';

const HUB_LINK_ICONS: Record<PublicHubLink, ComponentType<{ size?: number }>> = {
  cadastro: UserPlus,
  documentos: FileText,
  transparencia: Landmark,
  sugestoes: MessageSquareText,
  reservas: CalendarCheck,
  ponto: Clock3,
};

/** Configura os links do hub público e gera PDFs de QR Code para impressão. */
export function PublicQrCodesPage() {
  const condominium = useManagerCondominium();
  const { message } = App.useApp();
  const downloadQr = useDownloadPublicQrMutation(condominium.id);
  const updateCondo = useUpdateCondominiumMutation();

  const enabled = new Set(condominium.publicHubLinks ?? PUBLIC_HUB_LINKS);
  const canEditLinks =
    condominium.myRole === 'OWNER' || condominium.myRole === 'MANAGER';

  const handleDownload = (target: PublicQrTarget) => {
    downloadQr.mutate(target, {
      onSuccess: () =>
        message.success(`PDF do QR Code (${PUBLIC_QR_TARGET_LABELS[target]}) baixado.`),
      onError: (error: unknown) =>
        message.error(
          error instanceof ApiError
            ? error.message
            : 'Não foi possível gerar o PDF do QR Code.',
        ),
    });
  };

  const toggleHubLink = (link: PublicHubLink, checked: boolean) => {
    const next = checked
      ? PUBLIC_HUB_LINKS.filter((item) => enabled.has(item) || item === link)
      : PUBLIC_HUB_LINKS.filter((item) => enabled.has(item) && item !== link);

    updateCondo.mutate(
      { id: condominium.id, payload: { publicHubLinks: next } },
      {
        onSuccess: () =>
          message.success(
            checked
              ? `"${PUBLIC_HUB_LINK_LABELS[link]}" passou a aparecer na página pública.`
              : `"${PUBLIC_HUB_LINK_LABELS[link]}" foi ocultado da página pública.`,
          ),
        onError: (error: unknown) =>
          message.error(
            error instanceof ApiError
              ? error.message
              : 'Não foi possível atualizar os links públicos.',
          ),
      },
    );
  };

  return (
    <>
      <PageHeading
        title="Página pública"
        description="Escolha quais links aparecem para os moradores e gere QR Codes para impressão."
      />

      <S.SectionTitle>Links na página pública</S.SectionTitle>
      <S.Intro>
        Ative ou desative os atalhos exibidos em <code>/c/{condominium.slug}</code>. Contatos
        úteis continuam sendo gerenciados em Contatos.
      </S.Intro>

      <S.ToggleList>
        {PUBLIC_HUB_LINKS.map((link) => {
          const Icon = HUB_LINK_ICONS[link];

          return (
            <S.ToggleRow key={link}>
              <S.ToggleInfo>
                <S.Title>
                  <Icon size={16} style={{ verticalAlign: 'middle', marginRight: 8 }} />
                  {PUBLIC_HUB_LINK_LABELS[link]}
                </S.Title>
                <S.Hint>{PUBLIC_HUB_LINK_HINTS[link]}</S.Hint>
              </S.ToggleInfo>
              <Switch
                checked={enabled.has(link)}
                disabled={!canEditLinks || updateCondo.isPending}
                onChange={(checked) => toggleHubLink(link, checked)}
              />
            </S.ToggleRow>
          );
        })}
      </S.ToggleList>

      {!canEditLinks ? (
        <S.Intro>
          Somente proprietário ou gestor podem alterar quais links aparecem na página pública.
        </S.Intro>
      ) : null}

      <S.SectionTitle>QR Codes para impressão</S.SectionTitle>
      <S.Intro>
        Cada PDF traz o QR Code com moldura e o nome do condomínio no rodapé, pronto para
        portaria, murais ou comunicados.
      </S.Intro>

      <S.Grid>
        {PUBLIC_QR_TARGETS.map((target) => {
          const path = publicPathForTarget(condominium.slug, target);
          const isHubLink = target !== 'hub';
          const visibleOnHub = !isHubLink || enabled.has(target);

          return (
            <S.Card key={target} $muted={!visibleOnHub}>
              <div>
                <S.Title>
                  <QrCode size={16} style={{ verticalAlign: 'middle', marginRight: 8 }} />
                  {PUBLIC_QR_TARGET_LABELS[target]}
                </S.Title>
                <S.Hint>
                  {PUBLIC_QR_TARGET_HINTS[target]}
                  {!visibleOnHub ? ' · oculto no hub' : ''}
                </S.Hint>
              </div>

              <S.Path>{path}</S.Path>

              <S.Actions>
                <Button
                  type="primary"
                  icon={<Download size={16} />}
                  loading={downloadQr.isPending && downloadQr.variables === target}
                  onClick={() => handleDownload(target)}
                >
                  Baixar PDF
                </Button>
                <Button
                  href={path}
                  target="_blank"
                  rel="noreferrer"
                  icon={<ExternalLink size={16} />}
                >
                  Abrir link
                </Button>
              </S.Actions>
            </S.Card>
          );
        })}
      </S.Grid>
    </>
  );
}
