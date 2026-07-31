import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { residentsApi } from '../api/residents.api';
import type { ResidentFilters, ResidentPayload } from '../model/resident.types';

export const residentKeys = {
  all: ['residents'] as const,
  list: (filters: ResidentFilters) => [...residentKeys.all, 'list', filters] as const,
  detail: (id: string) => [...residentKeys.all, 'detail', id] as const,
};

export function useResidentsQuery(filters: ResidentFilters) {
  return useQuery({
    queryKey: residentKeys.list(filters),
    queryFn: () => residentsApi.list(filters),
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

export function useDeleteResidentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => residentsApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: residentKeys.all }),
  });
}
