export const DOCUMENT_TYPES = [
  'ANNOUNCEMENT',
  'ASSEMBLY_MINUTES',
  'ASSEMBLY_NOTICE',
  'OTHER',
  'DATA_INVENTORY',
] as const;
export type DocumentType = (typeof DOCUMENT_TYPES)[number];

/** Tipos oferecidos na criação manual (inventário LGPD é só via sync). */
export const MANUAL_DOCUMENT_TYPES = DOCUMENT_TYPES.filter((type) => type !== 'DATA_INVENTORY');

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  ANNOUNCEMENT: 'Aviso',
  ASSEMBLY_MINUTES: 'Ata de assembleia',
  ASSEMBLY_NOTICE: 'Convocação de assembleia',
  OTHER: 'Outro',
  DATA_INVENTORY: 'Inventário LGPD',
};

export interface CondoDocument {
  id: string;
  condominiumId: string;
  type: DocumentType;
  title: string;
  body: string;
  storageKey: string | null;
  isPublic: boolean;
  publishedAt: string | null;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentPayload {
  type: DocumentType;
  title: string;
  body: string;
  isPublic?: boolean;
  publishedAt?: string;
}
