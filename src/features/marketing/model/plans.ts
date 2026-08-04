export const LITE_MAX_UNITS = 10;

/** Fonte única da oferta comercial exibida na landing. */
export const TRIAL_DAYS = 30;

export type PlanId = 'lite' | 'prime' | 'gestor';

export interface Plan {
  id: PlanId;
  name: string;
  priceCents: number;
  periodLabel: string;
  summary: string;
  highlights: string[];
  /** Destaque visual no seletor (ex.: mais popular). */
  featured?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: 'lite',
    name: 'Lite',
    priceCents: 5900,
    periodLabel: '/mês',
    summary: 'Um condomínio com até 10 unidades.',
    highlights: [
      'Até 10 unidades',
      '1 condomínio',
      'Moradores, entregas e documentos',
      'Portal público do condomínio',
    ],
  },
  {
    id: 'prime',
    name: 'Prime',
    priceCents: 10_900,
    periodLabel: '/mês',
    summary: 'Um condomínio com unidades ilimitadas.',
    highlights: [
      'Unidades ilimitadas',
      '1 condomínio',
      'Todas as funções do Lite',
      'Financeiro e transparência',
    ],
    featured: true,
  },
  {
    id: 'gestor',
    name: 'Gestor',
    priceCents: 20_900,
    periodLabel: '/mês',
    summary: 'Vários prédios sob a mesma conta, com acesso completo.',
    highlights: [
      'Condomínios ilimitados',
      'Unidades ilimitadas',
      'Todas as opções da plataforma',
      'Ideal para administradoras',
    ],
  },
];

export function formatPlanPrice(cents: number): string {
  return (cents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  });
}

/** Registro com plano pré-selecionado (para CTAs da landing). */
export function registerPath(planId?: PlanId): string {
  return planId ? `/registro?plan=${planId}` : '/registro';
}

const PLAN_IDS: readonly PlanId[] = ['lite', 'prime', 'gestor'];

export function parsePlanId(value: string | null | undefined): PlanId | undefined {
  if (!value) {
    return undefined;
  }

  return PLAN_IDS.includes(value as PlanId) ? (value as PlanId) : undefined;
}

export function findPlan(planId: PlanId) {
  return PLANS.find((plan) => plan.id === planId);
}

/** Preferência de plano até o checkout existir (sessionStorage). */
export const selectedPlanStore = {
  key: 'condogest.selectedPlan',

  save(planId: PlanId): void {
    try {
      sessionStorage.setItem(this.key, planId);
    } catch {
      /* private mode / blocked storage */
    }
  },

  read(): PlanId | undefined {
    try {
      return parsePlanId(sessionStorage.getItem(this.key));
    } catch {
      return undefined;
    }
  },
};
