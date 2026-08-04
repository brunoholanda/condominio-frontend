import { httpClient } from '@/shared/api/http-client';
import type { DownloadedFile } from '@/shared/utils/download-file';
import { fileNameFromDisposition } from '@/shared/utils/download-file';
import type {
  PaginatedResidents,
  Resident,
  ResidentFilters,
  ResidentListItem,
  ResidentPayload,
  ResidentSearchFilters,
  ResidentsSummary,
} from '../model/resident.types';

/** A report covers every match, so it can take longer than a regular request. */
const REPORT_TIMEOUT_MS = 60_000;

/** Ceiling accepted by the API on `limit`. */
const MAX_PAGE_SIZE = 100;

function resource(condominiumId: string): string {
  return `/condominiums/${condominiumId}/residents`;
}

export const residentsApi = {
  async list(condominiumId: string, filters: ResidentFilters): Promise<PaginatedResidents> {
    const { data } = await httpClient.get<PaginatedResidents>(resource(condominiumId), {
      params: filters,
    });

    return data;
  },

  /**
   * Condomínio inteiro em uma lista só. A paginação existe para a tabela; quem
   * precisa de todo mundo — como a relação de moradores e telefones — percorre
   * as páginas restantes, que hoje raramente passam da primeira.
   */
  async listAll(condominiumId: string): Promise<ResidentListItem[]> {
    const firstPage = await residentsApi.list(condominiumId, { page: 1, limit: MAX_PAGE_SIZE });

    const otherPages = await Promise.all(
      Array.from({ length: firstPage.totalPages - 1 }, (_unused, index) =>
        residentsApi.list(condominiumId, { page: index + 2, limit: MAX_PAGE_SIZE }),
      ),
    );

    return [firstPage, ...otherPages].flatMap((page) => page.items);
  },

  async summary(condominiumId: string): Promise<ResidentsSummary> {
    const { data } = await httpClient.get<ResidentsSummary>(`${resource(condominiumId)}/summary`);

    return data;
  },

  /** Sinaliza que ninguém mora na unidade (ou remove a sinalização). */
  async setUnitVacancy(
    condominiumId: string,
    unitNumber: string,
    vacant: boolean,
  ): Promise<void> {
    await httpClient.post(`${resource(condominiumId)}/units/vacancy`, {
      unitNumber,
      vacant,
    });
  },

  /** PDF with one page per resident matching the filters. */
  async downloadReport(
    condominiumId: string,
    filters: ResidentSearchFilters,
  ): Promise<DownloadedFile> {
    const response = await httpClient.get<Blob>(`${resource(condominiumId)}/report`, {
      params: filters,
      responseType: 'blob',
      timeout: REPORT_TIMEOUT_MS,
    });

    return {
      blob: response.data,
      fileName: fileNameFromDisposition(response.headers['content-disposition'], 'moradores.pdf'),
    };
  },

  async getById(condominiumId: string, id: string): Promise<Resident> {
    const { data } = await httpClient.get<Resident>(`${resource(condominiumId)}/${id}`);

    return data;
  },

  /** Cadastro público de uma unidade, aberto a qualquer visitante do link do condomínio. */
  async createPublic(slug: string, payload: ResidentPayload): Promise<Resident> {
    const { data } = await httpClient.post<Resident>(`/c/${slug}/residents`, payload);

    return data;
  },

  async update(condominiumId: string, id: string, payload: ResidentPayload): Promise<Resident> {
    const { data } = await httpClient.put<Resident>(`${resource(condominiumId)}/${id}`, payload);

    return data;
  },

  async remove(condominiumId: string, id: string): Promise<void> {
    await httpClient.delete(`${resource(condominiumId)}/${id}`);
  },
};
