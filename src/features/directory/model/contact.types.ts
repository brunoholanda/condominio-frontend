export const CONTACT_CATEGORIES = ['DOORMAN', 'SYNDIC', 'ADMIN', 'CUSTOM'] as const;
export type ContactCategory = (typeof CONTACT_CATEGORIES)[number];

export const CONTACT_CATEGORY_LABELS: Record<ContactCategory, string> = {
  DOORMAN: 'Portaria',
  SYNDIC: 'Síndico',
  ADMIN: 'Administradora',
  CUSTOM: 'Outro',
};

export interface UsefulContact {
  id: string;
  condominiumId: string;
  label: string;
  phone: string | null;
  url: string | null;
  category: ContactCategory;
  sortOrder: number;
  createdAt: string;
}

export interface UsefulContactPayload {
  label: string;
  phone?: string;
  url?: string;
  category: ContactCategory;
  sortOrder?: number;
}
