import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { saveFile } from '@/shared/utils/download-file';
import { residentsApi } from '../api/residents.api';
import type {
  ResidentFilters,
  ResidentPayload,
  ResidentSearchFilters,
} from '../model/resident.types';

export const residentKeys = {
  all: ['residents'] as const,
  list: (filters: ResidentFilters) => [...residentKeys.all, 'list', filters] as const,
  everyone: () => [...residentKeys.all, 'everyone'] as const,
  detail: (id: string) => [...residentKeys.all, 'detail', id] as const,
  summary: () => [...residentKeys.all, 'summary'] as const,
};

/** Counters of the restricted area; refreshed by every save or removal. */
export function useResidentsSummaryQuery() {
  return useQuery({
    queryKey: residentKeys.summary(),
    queryFn: () => residentsApi.summary(),
  });
}

export function useResidentsQuery(filters: ResidentFilters) {
  return useQuery({
    queryKey: residentKeys.list(filters),
    queryFn: () => residentsApi.list(filters),
  });
}

/** Todos os cadastros de uma vez; só busca quando a tela que precisa deles abre. */
export function useAllResidentsQuery(enabled: boolean) {
  return useQuery({
    queryKey: residentKeys.everyone(),
    queryFn: () => residentsApi.listAll(),
    enabled,
  });
}

export function useResidentQuery(id: string | undefined) {
  return useQuery({
    queryKey: residentKeys.detail(id ?? ''),
    queryFn: () => residentsApi.getById(id as string),
    enabled: Boolean(id),
  });
}

interface SaveResidentInput {
  id?: string;
  payload: ResidentPayload;
}

/** Create and update share the same contract, so a single mutation covers both. */
export function useSaveResidentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: SaveResidentInput) =>
      id ? residentsApi.update(id, payload) : residentsApi.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: residentKeys.all }),
  });
}

/** Downloads the PDF report and hands it straight to the browser. */
export function useResidentsReportMutation() {
  return useMutation({
    mutationFn: (filters: ResidentSearchFilters) => residentsApi.downloadReport(filters),
    onSuccess: (file) => saveFile(file),
  });
}

export function useDeleteResidentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => residentsApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: residentKeys.all }),
  });
}
