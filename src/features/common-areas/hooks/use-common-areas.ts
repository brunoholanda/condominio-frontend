import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { commonAreasApi } from '../api/common-areas.api';
import type { CommonAreaPayload } from '../model/common-area.types';

export const commonAreaKeys = {
  all: (condominiumId: string) => ['common-areas', condominiumId] as const,
  public: (slug: string) => ['common-areas', 'public', slug] as const,
};

export function useCommonAreasQuery(condominiumId: string) {
  return useQuery({
    queryKey: commonAreaKeys.all(condominiumId),
    queryFn: () => commonAreasApi.list(condominiumId),
    enabled: Boolean(condominiumId),
  });
}

export function usePublicCommonAreasQuery(slug: string | undefined) {
  return useQuery({
    queryKey: commonAreaKeys.public(slug ?? ''),
    queryFn: () => commonAreasApi.listPublic(slug as string),
    enabled: Boolean(slug),
  });
}

function useInvalidateCommonAreas(condominiumId: string) {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries({ queryKey: commonAreaKeys.all(condominiumId) });
}

export function useCreateCommonAreaMutation(condominiumId: string) {
  const invalidate = useInvalidateCommonAreas(condominiumId);

  return useMutation({
    mutationFn: (payload: CommonAreaPayload) => commonAreasApi.create(condominiumId, payload),
    onSuccess: invalidate,
  });
}

interface UpdateCommonAreaInput {
  areaId: string;
  payload: CommonAreaPayload;
}

export function useUpdateCommonAreaMutation(condominiumId: string) {
  const invalidate = useInvalidateCommonAreas(condominiumId);

  return useMutation({
    mutationFn: ({ areaId, payload }: UpdateCommonAreaInput) =>
      commonAreasApi.update(condominiumId, areaId, payload),
    onSuccess: invalidate,
  });
}

export function useDeleteCommonAreaMutation(condominiumId: string) {
  const invalidate = useInvalidateCommonAreas(condominiumId);

  return useMutation({
    mutationFn: (areaId: string) => commonAreasApi.remove(condominiumId, areaId),
    onSuccess: invalidate,
  });
}
