export const PAYABLE_STATUSES = ['PENDING', 'PAID', 'CANCELLED'] as const;
export type PayableStatus = (typeof PAYABLE_STATUSES)[number];

export const PAYABLE_STATUS_LABELS: Record<PayableStatus, string> = {
  PENDING: 'Pendente',
  PAID: 'Paga',
  CANCELLED: 'Cancelada',
};

export const PAYABLE_STATUS_COLORS: Record<PayableStatus, string> = {
  PENDING: 'gold',
  PAID: 'green',
  CANCELLED: 'default',
};

export interface Payable {
  id: string;
  condominiumId: string;
  description: string;
  vendor: string;
  category: string;
  amountCents: number;
  dueDate: string;
  status: PayableStatus;
  paidAt: string | null;
  notes: string | null;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PayablePayload {
  description: string;
  vendor: string;
  category: string;
  amountCents: number;
  dueDate: string;
  notes?: string | null;
}

export interface PayableFilters {
  status?: PayableStatus;
  category?: string;
  search?: string;
  page: number;
  limit: number;
}

export interface PaginatedPayables {
  items: Payable[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const ATTACHMENT_TYPES = ['INVOICE', 'SERVICE_NOTE', 'CONTRACT', 'OTHER'] as const;
export type AttachmentType = (typeof ATTACHMENT_TYPES)[number];

export const ATTACHMENT_TYPE_LABELS: Record<AttachmentType, string> = {
  INVOICE: 'Nota fiscal',
  SERVICE_NOTE: 'Nota de serviço',
  CONTRACT: 'Contrato',
  OTHER: 'Outro',
};

export interface PayableAttachment {
  id: string;
  payableId: string;
  type: AttachmentType;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  uploadedByUserId: string;
  createdAt: string;
}
