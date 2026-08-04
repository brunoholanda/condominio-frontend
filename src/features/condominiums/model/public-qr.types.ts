export const PUBLIC_HUB_LINKS = [
  'cadastro',
  'documentos',
  'transparencia',
  'sugestoes',
  'reservas',
  'ponto',
] as const;

export type PublicHubLink = (typeof PUBLIC_HUB_LINKS)[number];

export const PUBLIC_QR_TARGETS = ['hub', ...PUBLIC_HUB_LINKS] as const;
export type PublicQrTarget = (typeof PUBLIC_QR_TARGETS)[number];

export const PUBLIC_HUB_LINK_LABELS: Record<PublicHubLink, string> = {
  cadastro: 'Cadastro de morador',
  documentos: 'Documentos',
  transparencia: 'Portal da transparência',
  sugestoes: 'Caixa de sugestões',
  reservas: 'Reservas de áreas comuns',
  ponto: 'Ponto eletrônico',
};

export const PUBLIC_QR_TARGET_LABELS: Record<PublicQrTarget, string> = {
  hub: 'Página pública',
  ...PUBLIC_HUB_LINK_LABELS,
};

export const PUBLIC_HUB_LINK_HINTS: Record<PublicHubLink, string> = {
  cadastro: 'Formulário de cadastro da unidade',
  documentos: 'Avisos, atas e convocações',
  transparencia: 'Contas pagas e anexos',
  sugestoes: 'Caixa de sugestões dos moradores',
  reservas: 'Reserva de áreas comuns',
  ponto: 'Registro de ponto dos funcionários',
};

export const PUBLIC_QR_TARGET_HINTS: Record<PublicQrTarget, string> = {
  hub: 'Entrada principal com todos os serviços',
  ...PUBLIC_HUB_LINK_HINTS,
};

export function publicPathForTarget(slug: string, target: PublicQrTarget): string {
  switch (target) {
    case 'hub':
      return `/c/${slug}`;
    case 'cadastro':
      return `/c/${slug}/cadastro`;
    case 'documentos':
      return `/c/${slug}/documentos`;
    case 'transparencia':
      return `/c/${slug}/transparencia`;
    case 'sugestoes':
      return `/c/${slug}/sugestoes`;
    case 'reservas':
      return `/c/${slug}/reservas`;
    case 'ponto':
      return `/c/${slug}/ponto`;
  }
}
