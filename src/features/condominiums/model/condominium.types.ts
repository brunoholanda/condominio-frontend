import type { PublicHubLink } from './public-qr.types';

export type { PublicHubLink } from './public-qr.types';

export const MEMBERSHIP_ROLES = ['OWNER', 'MANAGER', 'OPERATOR', 'DOORMAN'] as const;
export type MembershipRole = (typeof MEMBERSHIP_ROLES)[number];

export const MEMBERSHIP_ROLE_LABELS: Record<MembershipRole, string> = {
  OWNER: 'Proprietário',
  MANAGER: 'Gestor',
  OPERATOR: 'Operador',
  DOORMAN: 'Porteiro',
};

export const MEMBERSHIP_ROLE_DESCRIPTIONS: Record<MembershipRole, string> = {
  OWNER: 'Controle total, inclusive da equipe',
  MANAGER: 'Financeiro, áreas, documentos, moradores e encomendas',
  OPERATOR: 'Somente cadastros de moradores',
  DOORMAN: 'Registra e entrega encomendas na portaria',
};

export interface CondoMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: MembershipRole;
  createdAt: string;
}

export interface AddCondoMemberPayload {
  email: string;
  role: MembershipRole;
  /** Obrigatório só quando o e-mail ainda não tem conta. */
  name?: string;
  password?: string;
}

export interface Condominium {
  id: string;
  name: string;
  slug: string;
  buildingHandoverDate: string | null;
  unitNumbers: string[];
  /** Atalhos de serviço exibidos no hub público. */
  publicHubLinks: PublicHubLink[];
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  geofenceRadiusMeters: number | null;
  /** Papel do usuário autenticado neste condomínio. */
  myRole?: MembershipRole;
  createdAt: string;
  updatedAt: string;
}

/** O que um visitante vê sem estar autenticado. */
export interface PublicCondominium {
  id: string;
  name: string;
  slug: string;
  publicHubLinks: PublicHubLink[];
}

export interface CondominiumPayload {
  name: string;
  slug: string;
  unitNumbers: string[];
  buildingHandoverDate?: string | null;
  address: string;
  latitude: number;
  longitude: number;
  geofenceRadiusMeters?: number;
}

export type UpdateCondominiumPayload = Partial<CondominiumPayload> & {
  publicHubLinks?: PublicHubLink[];
};

/** Aceita uma unidade por linha ou separadas por vírgula, na mesma caixa de texto. */
export function parseUnitNumbers(raw: string): string[] {
  const units = raw
    .split(/[\n,]/)
    .map((unit) => unit.trim())
    .filter((unit) => unit.length > 0);

  return [...new Set(units)];
}

/** Kebab-case simples, para sugerir o slug a partir do nome do condomínio. */
export function slugify(raw: string): string {
  return raw
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}
