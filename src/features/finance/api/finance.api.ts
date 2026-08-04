import { httpClient } from '@/shared/api/http-client';
import type { DownloadedFile } from '@/shared/utils/download-file';
import { fileNameFromDisposition } from '@/shared/utils/download-file';
import type {
  AttachmentType,
  PaginatedPayables,
  Payable,
  PayableAttachment,
  PayableFilters,
  PayablePayload,
} from '../model/finance.types';
import type {
  PaginatedTransparencyPayables,
  TransparencyPayableDetail,
} from '../model/transparency.types';

function resource(condominiumId: string): string {
  return `/condominiums/${condominiumId}/payables`;
}

export const financeApi = {
  async list(condominiumId: string, filters: PayableFilters): Promise<PaginatedPayables> {
    const { data } = await httpClient.get<PaginatedPayables>(resource(condominiumId), {
      params: filters,
    });

    return data;
  },

  async getById(condominiumId: string, id: string): Promise<Payable> {
    const { data } = await httpClient.get<Payable>(`${resource(condominiumId)}/${id}`);

    return data;
  },

  async create(condominiumId: string, payload: PayablePayload): Promise<Payable> {
    const { data } = await httpClient.post<Payable>(resource(condominiumId), payload);

    return data;
  },

  async update(condominiumId: string, id: string, payload: PayablePayload): Promise<Payable> {
    const { data } = await httpClient.put<Payable>(`${resource(condominiumId)}/${id}`, payload);

    return data;
  },

  async markAsPaid(condominiumId: string, id: string, note?: string): Promise<Payable> {
    const { data } = await httpClient.post<Payable>(`${resource(condominiumId)}/${id}/pay`, {
      note,
    });

    return data;
  },

  async cancel(condominiumId: string, id: string, note?: string): Promise<Payable> {
    const { data } = await httpClient.post<Payable>(`${resource(condominiumId)}/${id}/cancel`, {
      note,
    });

    return data;
  },

  async listAttachments(condominiumId: string, payableId: string): Promise<PayableAttachment[]> {
    const { data } = await httpClient.get<PayableAttachment[]>(
      `${resource(condominiumId)}/${payableId}/attachments`,
    );

    return data;
  },

  async uploadAttachment(
    condominiumId: string,
    payableId: string,
    file: File,
    type: AttachmentType,
  ): Promise<PayableAttachment> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const { data } = await httpClient.post<PayableAttachment>(
      `${resource(condominiumId)}/${payableId}/attachments`,
      formData,
    );

    return data;
  },

  async downloadAttachment(
    condominiumId: string,
    payableId: string,
    attachmentId: string,
  ): Promise<DownloadedFile> {
    const response = await httpClient.get<Blob>(
      `${resource(condominiumId)}/${payableId}/attachments/${attachmentId}`,
      { responseType: 'blob' },
    );

    return {
      blob: response.data,
      fileName: fileNameFromDisposition(response.headers['content-disposition'], 'anexo'),
    };
  },

  async deleteAttachment(
    condominiumId: string,
    payableId: string,
    attachmentId: string,
  ): Promise<void> {
    await httpClient.delete(`${resource(condominiumId)}/${payableId}/attachments/${attachmentId}`);
  },
};

export const transparencyApi = {
  async list(slug: string, page = 1, limit = 20): Promise<PaginatedTransparencyPayables> {
    const { data } = await httpClient.get<PaginatedTransparencyPayables>(`/c/${slug}/transparency`, {
      params: { page, limit },
    });

    return data;
  },

  async getById(slug: string, payableId: string): Promise<TransparencyPayableDetail> {
    const { data } = await httpClient.get<TransparencyPayableDetail>(
      `/c/${slug}/transparency/${payableId}`,
    );

    return data;
  },

  async downloadAttachment(
    slug: string,
    payableId: string,
    attachmentId: string,
  ): Promise<DownloadedFile> {
    const response = await httpClient.get<Blob>(
      `/c/${slug}/transparency/${payableId}/attachments/${attachmentId}`,
      { responseType: 'blob' },
    );

    return {
      blob: response.data,
      fileName: fileNameFromDisposition(response.headers['content-disposition'], 'anexo'),
    };
  },
};
