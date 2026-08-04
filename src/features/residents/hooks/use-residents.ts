import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { saveFile } from '@/shared/utils/download-file';
import { residentsApi } from '../api/residents.api';
import type {
  ResidentFilters,
  ResidentPayload,
  ResidentSearchFilters,
} from '../model/resident.types';

export const residentKeys = {
  all: (condominiumId: string) => ['residents', condominiumId] as const,
  list: (condominiumId: string, filters: ResidentFilters) =>
    [...residentKeys.all(condominiumId), 'list', filters] as const,
  everyone: (condominiumId: string) => [...residentKeys.all(condominiumId), 'everyone'] as const,
  detail: (condominiumId: string, id: string) =>
    [...residentKeys.all(condominiumId), 'detail', id] as const,
  summary: (condominiumId: string) => [...residentKeys.all(condominiumId), 'summary'] as const,
};

/** Counters of the restricted area; refreshed by every save or removal. */
export function useResidentsSummaryQuery(condominiumId: string) {
  return useQuery({
    queryKey: residentKeys.summary(condominiumId),
    queryFn: () => residentsApi.summary(condominiumId),
    enabled: Boolean(condominiumId),
  });
}

export function useResidentsQuery(condominiumId: string, filters: ResidentFilters) {
  return useQuery({
    queryKey: residentKeys.list(condominiumId, filters),
    queryFn: () => residentsApi.list(condominiumId, filters),
    enabled: Boolean(condominiumId),
  });
}

/** Todos os cadastros de uma vez; só busca quando a tela que precisa deles abre. */
export function useAllResidentsQuery(condominiumId: string, enabled: boolean) {
  return useQuery({
    queryKey: residentKeys.everyone(condominiumId),
    queryFn: () => residentsApi.listAll(condominiumId),
    enabled: enabled && Boolean(condominiumId),
  });
}

export function useResidentQuery(condominiumId: string, id: string | undefined) {
  return useQuery({
    queryKey: residentKeys.detail(condominiumId, id ?? ''),
    queryFn: () => residentsApi.getById(condominiumId, id as string),
    enabled: Boolean(condominiumId) && Boolean(id),
  });
}

/** Ficha pública de uma unidade recém-cadastrada, buscada sem exigir vínculo. */
export function usePublicResidentMutation(slug: string) {
  return useMutation({
    mutationFn: (payload: ResidentPayload) => residentsApi.createPublic(slug, payload),
  });
}

interface SaveResidentInput {
  condominiumId: string;
  id: string;
  payload: ResidentPayload;
}

/** Only administrators can edit an existing registration (PUT). */
export function useSaveResidentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ condominiumId, id, payload }: SaveResidentInput) =>
      residentsApi.update(condominiumId, id, payload),
    onSuccess: (_data, variables) =>
      queryClient.invalidateQueries({ queryKey: residentKeys.all(variables.condominiumId) }),
  });
}

interface DownloadReportInput {
  condominiumId: string;
  filters: ResidentSearchFilters;
}

/** Downloads the PDF report and hands it straight to the browser. */
export function useResidentsReportMutation() {
  return useMutation({
    mutationFn: ({ condominiumId, filters }: DownloadReportInput) =>
      residentsApi.downloadReport(condominiumId, filters),
    onSuccess: (file) => saveFile(file),
  });
}

interface DeleteResidentInput {
  condominiumId: string;
  id: string;
}

export function useDeleteResidentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ condominiumId, id }: DeleteResidentInput) =>
      residentsApi.remove(condominiumId, id),
    onSuccess: (_data, variables) =>
      queryClient.invalidateQueries({ queryKey: residentKeys.all(variables.condominiumId) }),
  });
}

interface SetUnitVacancyInput {
  unitNumber: string;
  vacant: boolean;
}

/** Marca ou remove a sinalização de unidade desocupada no acompanhamento de cadastros. */
export function useSetUnitVacancyMutation(condominiumId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ unitNumber, vacant }: SetUnitVacancyInput) =>
      residentsApi.setUnitVacancy(condominiumId, unitNumber, vacant),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: residentKeys.summary(condominiumId) }),
  });
}
