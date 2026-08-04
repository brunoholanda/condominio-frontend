import { PLANS, TRIAL_DAYS } from './plans';

/** URL canônica do site em produção (sem barra final). */
export const SITE_URL = (
  import.meta.env.VITE_PUBLIC_SITE_URL as string | undefined
)?.replace(/\/$/, '') || 'https://condogest.com.br';

export const SEO = {
  siteName: 'CondoGest',
  title: 'CondoGest | Gestão de condomínios — teste grátis 30 dias',
  description:
    'Sistema de gestão de condomínios com cadastro de moradores, entregas, financeiro e portal público. Teste grátis por 30 dias. Planos Lite, Prime e Gestor a partir de R$ 59/mês.',
  keywords: [
    'gestão de condomínios',
    'software para síndico',
    'cadastro de moradores',
    'sistema condominial',
    'CondoGest',
    'portal do condomínio',
  ].join(', '),
  locale: 'pt_BR',
  author: 'CondoGest — Holanda Dev Software',
} as const;

const JSON_LD_GRAPH_ID = 'condogest-jsonld';

/** Script JSON-LD único (@graph) — evita duplicar Organization/WebSite/Software. */
export function buildJsonLdDocument(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: SEO.siteName,
        url: SITE_URL,
        logo: `${SITE_URL}/favicon.svg`,
        description: SEO.description,
      },
      {
        '@type': 'WebSite',
        name: SEO.siteName,
        url: SITE_URL,
        description: SEO.description,
        inLanguage: 'pt-BR',
        potentialAction: {
          '@type': 'RegisterAction',
          target: `${SITE_URL}/registro`,
          name: `Começar teste grátis de ${TRIAL_DAYS} dias`,
        },
      },
      {
        '@type': 'SoftwareApplication',
        name: SEO.siteName,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        url: SITE_URL,
        description: SEO.description,
        inLanguage: 'pt-BR',
        offers: PLANS.map((plan) => ({
          '@type': 'Offer',
          name: `Plano ${plan.name}`,
          description: plan.summary,
          price: (plan.priceCents / 100).toFixed(2),
          priceCurrency: 'BRL',
          url: `${SITE_URL}/registro?plan=${plan.id}`,
          availability: 'https://schema.org/InStock',
        })),
      },
    ],
  };
}

export { JSON_LD_GRAPH_ID };
