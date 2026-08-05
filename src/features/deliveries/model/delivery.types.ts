export const PACKAGE_STATUSES = ['WAITING', 'DELIVERED'] as const;
export type PackageStatus = (typeof PACKAGE_STATUSES)[number];

export const PACKAGE_STATUS_LABELS: Record<PackageStatus, string> = {
  WAITING: 'Aguardando retirada',
  DELIVERED: 'Entregue',
};

export const PACKAGE_STATUS_COLORS: Record<PackageStatus, string> = {
  WAITING: 'gold',
  DELIVERED: 'green',
};

export interface PackageListItem {
  id: string;
  unitNumber: string;
  description: string;
  carrier: string | null;
  status: PackageStatus;
  receivedAt: string;
  deliveredAt: string | null;
  recipientName: string | null;
  notes: string | null;
}

export interface CondoPackage extends PackageListItem {
  condominiumId: string;
  receivedByUserId: string | null;
  receivedByEmployeeId?: string | null;
  deliveredByUserId: string | null;
  deliveredByEmployeeId?: string | null;
  signature: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedPackages {
  items: PackageListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PackageFilters {
  page?: number;
  limit?: number;
  status?: PackageStatus;
  unitNumber?: string;
  search?: string;
}

export interface CreatePackagePayload {
  unitNumber: string;
  description: string;
  carrier?: string | null;
  notes?: string | null;
}

export interface DeliverPackagePayload {
  recipientName: string;
  signature: string;
}

export interface SigningSession {
  token: string;
  expiresAt: string;
  signUrl: string;
  qrPngDataUrl: string;
}

export interface PublicSigningSession {
  condominiumName: string;
  unitNumber: string;
  description: string;
  expiresAt: string;
}

export interface CompletePublicSigningResult {
  deliveredAt: string;
}
