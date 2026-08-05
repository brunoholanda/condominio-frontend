export const VISITOR_PASS_STATUSES = [
  'PENDING',
  'CHECKED_IN',
  'CANCELLED',
  'EXPIRED',
] as const;

export type VisitorPassStatus = (typeof VISITOR_PASS_STATUSES)[number];

export const VISITOR_PASS_STATUS_LABELS: Record<VisitorPassStatus, string> = {
  PENDING: 'Aguardando',
  CHECKED_IN: 'Entrou',
  CANCELLED: 'Cancelado',
  EXPIRED: 'Expirado',
};

export const VISITOR_PASS_STATUS_COLORS: Record<VisitorPassStatus, string> = {
  PENDING: 'gold',
  CHECKED_IN: 'green',
  CANCELLED: 'default',
  EXPIRED: 'red',
};

export interface VisitorPass {
  id: string;
  condominiumId: string;
  visitorName: string;
  visitorDocument: string | null;
  hostName: string;
  unitNumber: string | null;
  expectedAt: string;
  expiresAt: string;
  status: VisitorPassStatus;
  notes: string | null;
  createdByUserId: string | null;
  createdByEmployeeId?: string | null;
  checkedInAt: string | null;
  checkedInByUserId: string | null;
  checkedInByEmployeeId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVisitorPassPayload {
  visitorName: string;
  visitorDocument?: string | null;
  hostName: string;
  unitNumber?: string | null;
  expectedAt: string;
  expiresAt: string;
  notes?: string | null;
}

export interface VisitorPassFilters {
  status?: VisitorPassStatus;
  from?: string;
  to?: string;
}
