export type FormerResidentReason = 'UPDATE' | 'DELETE';

export interface FormerResidentListItem {
  id: string;
  condominiumId: string;
  unit: string;
  sourceResidentId: string;
  reason: FormerResidentReason;
  fullName: string;
  cpfMasked: string;
  supersededAt: string;
  retainUntil: string;
  supersededByUserId: string | null;
}

export interface FormerResidentDetail extends FormerResidentListItem {
  payload: Record<string, unknown>;
}

export const FORMER_RESIDENT_REASON_LABELS: Record<FormerResidentReason, string> = {
  UPDATE: 'Substituição do cadastro',
  DELETE: 'Exclusão do cadastro',
};
