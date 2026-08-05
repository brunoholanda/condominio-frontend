export interface CommonArea {
  id: string;
  condominiumId: string;
  name: string;
  description: string | null;
  rules: string | null;
  costCents: number;
  capacity: number;
  active: boolean;
  autoApprove: boolean;
  minAdvanceHours: number;
  cancelBeforeHours: number;
  createdAt: string;
  updatedAt: string;
}

export interface CommonAreaPayload {
  name: string;
  description?: string | null;
  rules?: string | null;
  costCents?: number;
  capacity?: number;
  active?: boolean;
  autoApprove?: boolean;
  minAdvanceHours?: number;
  cancelBeforeHours?: number;
}

export const BOOKING_STATUSES = ['REQUESTED', 'APPROVED', 'REJECTED', 'CANCELLED'] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  REQUESTED: 'Solicitada',
  APPROVED: 'Aprovada',
  REJECTED: 'Recusada',
  CANCELLED: 'Cancelada',
};

export const BOOKING_STATUS_COLORS: Record<BookingStatus, string> = {
  REQUESTED: 'gold',
  APPROVED: 'green',
  REJECTED: 'red',
  CANCELLED: 'default',
};

export interface Booking {
  id: string;
  commonAreaId: string;
  condominiumId: string;
  unitNumber: string;
  residentId: string;
  startsAt: string;
  endsAt: string;
  status: BookingStatus;
  costSnapshotCents: number;
  rulesAcceptedAt: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingPayload {
  commonAreaId: string;
  startsAt: string;
  endsAt: string;
  acceptRules: boolean;
  notes?: string | null;
}

export interface BookingFilters {
  commonAreaId?: string;
  status?: BookingStatus;
}

export interface ResidentAccount {
  id: string;
  userId: string;
  condominiumId: string;
  unitNumber: string;
  createdAt: string;
}

export interface CreateResidentAccountPayload {
  email: string;
  unitNumber: string;
}
