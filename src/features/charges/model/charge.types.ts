export const CHARGE_STATUSES = ['PENDING', 'PAID', 'CANCELLED'] as const;
export type ChargeStatus = (typeof CHARGE_STATUSES)[number];
export type ChargeDisplayStatus = ChargeStatus | 'OVERDUE';

export const CHARGE_STATUS_LABELS: Record<ChargeDisplayStatus, string> = {
  PENDING: 'Em aberto',
  PAID: 'Paga',
  CANCELLED: 'Cancelada',
  OVERDUE: 'Vencida',
};

export const CHARGE_STATUS_COLORS: Record<ChargeDisplayStatus, string> = {
  PENDING: 'gold',
  PAID: 'green',
  CANCELLED: 'default',
  OVERDUE: 'red',
};

export interface Charge {
  id: string;
  condominiumId: string;
  batchId: string | null;
  unitNumber: string;
  residentId: string | null;
  payerName: string;
  payerCpf: string | null;
  description: string;
  amountCents: number;
  dueDate: string;
  status: ChargeStatus;
  displayStatus: ChargeDisplayStatus;
  asaasPaymentId: string | null;
  pixPayload: string | null;
  pixQrCodeBase64: string | null;
  pixExpirationDate: string | null;
  invoiceUrl: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ChargeFilters {
  status?: ChargeStatus;
  unitNumber?: string;
  batchId?: string;
  search?: string;
  page: number;
  limit: number;
}

export interface PaginatedCharges {
  items: Charge[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ChargeSummary {
  pendingCount: number;
  paidCount: number;
  cancelledCount: number;
  pendingAmountCents: number;
  paidAmountCents: number;
}

export interface GenerateChargesPayload {
  description: string;
  referenceMonth: string;
  dueDate: string;
  amountCents: number;
  unitNumbers: string[];
}

export interface GenerateChargesResult {
  batchId: string;
  created: Charge[];
  failures: Array<{ unitNumber: string; error: string }>;
}

export interface AsaasSettings {
  configured: boolean;
  enabled: boolean;
  apiKeyHint: string | null;
  walletId: string | null;
}

export interface UpsertAsaasSettingsPayload {
  apiKey: string;
  walletId?: string | null;
  enabled?: boolean;
}
