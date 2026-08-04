import { httpClient } from '@/shared/api/http-client';
import type {
  CreateTicketPayload,
  SupportTicket,
  TicketCategory,
  TicketStatus,
  UpdateTicketStatusPayload,
} from '../model/support.types';

export const supportApi = {
  async create(payload: CreateTicketPayload): Promise<SupportTicket> {
    const { data } = await httpClient.post<SupportTicket>('/support/tickets', payload);

    return data;
  },

  async listMine(): Promise<SupportTicket[]> {
    const { data } = await httpClient.get<SupportTicket[]>('/support/tickets/mine');

    return data;
  },

  async listAll(filters?: {
    status?: TicketStatus;
    category?: TicketCategory;
  }): Promise<SupportTicket[]> {
    const { data } = await httpClient.get<SupportTicket[]>('/admin/support/tickets', {
      params: {
        ...(filters?.status ? { status: filters.status } : {}),
        ...(filters?.category ? { category: filters.category } : {}),
      },
    });

    return data;
  },

  async updateStatus(id: string, payload: UpdateTicketStatusPayload): Promise<SupportTicket> {
    const { data } = await httpClient.patch<SupportTicket>(
      `/admin/support/tickets/${id}/status`,
      payload,
    );

    return data;
  },
};
