import { httpClient } from '@/shared/api/http-client';
import type { DownloadedFile } from '@/shared/utils/download-file';
import { fileNameFromDisposition } from '@/shared/utils/download-file';
import type {
  PaginatedResidents,
  Resident,
  ResidentFilters,
  ResidentPayload,
  ResidentSearchFilters,
  ResidentsSummary,
} from '../model/resident.types';

const RESOURCE = '/residents';

/** A report covers every match, so it can take longer than a regular request. */
const REPORT_TIMEOUT_MS = 60_000;

export const residentsApi = {
  async list(filters: ResidentFilters): Promise<PaginatedResidents> {
    const { data } = await httpClient.get<PaginatedResidents>(RESOURCE, { params: filters });

    return data;
  },

  async summary(): Promise<ResidentsSummary> {
    const { data } = await httpClient.get<ResidentsSummary>(`${RESOURCE}/summary`);

    return data;
  },

  /** PDF with one page per resident matching the filters. */
  async downloadReport(filters: ResidentSearchFilters): Promise<DownloadedFile> {
    const response = await httpClient.get<Blob>(`${RESOURCE}/report`, {
      params: filters,
      responseType: 'blob',
      timeout: REPORT_TIMEOUT_MS,
    });

    return {
      blob: response.data,
      fileName: fileNameFromDisposition(response.headers['content-disposition'], 'moradores.pdf'),
    };
  },

  async getById(id: string): Promise<Resident> {
    const { data } = await httpClient.get<Resident>(`${RESOURCE}/${id}`);

    return data;
  },

  async create(payload: ResidentPayload): Promise<Resident> {
    const { data } = await httpClient.post<Resident>(RESOURCE, payload);

    return data;
  },

  async update(id: string, payload: ResidentPayload): Promise<Resident> {
    const { data } = await httpClient.put<Resident>(`${RESOURCE}/${id}`, payload);

    return data;
  },

  async remove(id: string): Promise<void> {
    await httpClient.delete(`${RESOURCE}/${id}`);
  },
};
