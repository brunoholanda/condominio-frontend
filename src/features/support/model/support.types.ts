export type TicketCategory = 'PROBLEM' | 'IMPROVEMENT';
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export const TICKET_CATEGORIES: TicketCategory[] = ['PROBLEM', 'IMPROVEMENT'];
export const TICKET_STATUSES: TicketStatus[] = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

export const TICKET_CATEGORY_LABELS: Record<TicketCategory, string> = {
  PROBLEM: 'Problema',
  IMPROVEMENT: 'Melhoria',
};

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  OPEN: 'Aberto',
  IN_PROGRESS: 'Em andamento',
  RESOLVED: 'Resolvido',
  CLOSED: 'Fechado',
};

export const TICKET_STATUS_COLORS: Record<TicketStatus, string> = {
  OPEN: 'blue',
  IN_PROGRESS: 'gold',
  RESOLVED: 'green',
  CLOSED: 'default',
};

export interface SupportTicket {
  id: string;
  userId: string;
  category: TicketCategory;
  subject: string;
  body: string;
  status: TicketStatus;
  condominiumId: string | null;
  createdAt: string;
  updatedAt: string;
  authorName?: string;
  authorEmail?: string;
}

export interface CreateTicketPayload {
  category: TicketCategory;
  subject: string;
  body: string;
  condominiumId?: string;
}

export interface UpdateTicketStatusPayload {
  status: TicketStatus;
}
