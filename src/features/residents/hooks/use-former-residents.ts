import { useQuery } from '@tanstack/react-query';

import { formerResidentsApi } from '../api/former-residents.api';

export const formerResidentKeys = {
  all: (condominiumId: string) => ['former-residents', condominiumId] as const,
  list: (condominiumId: string, unit?: string) =>
    [...formerResidentKeys.all(condominiumId), 'list', unit ?? 'all'] as const,
  detail: (condominiumId: string, id: string) =>
    [...formerResidentKeys.all(condominiumId), 'detail', id] as const,
};

export function useFormerResidentsQuery(
  condominiumId: string,
  unit: string | undefined,
  enabled: boolean,
) {
  return useQuery({
    queryKey: formerResidentKeys.list(condominiumId, unit),
    queryFn: () => formerResidentsApi.list(condominiumId, unit),
    enabled: enabled && Boolean(condominiumId),
  });
}

export function useFormerResidentDetailQuery(
  condominiumId: string,
  recordId: string | undefined,
  enabled: boolean,
) {
  return useQuery({
    queryKey: formerResidentKeys.detail(condominiumId, recordId ?? ''),
    queryFn: () => formerResidentsApi.getById(condominiumId, recordId as string),
    enabled: enabled && Boolean(condominiumId) && Boolean(recordId),
  });
}
