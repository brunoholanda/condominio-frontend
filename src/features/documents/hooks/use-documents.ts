import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { documentsApi } from '../api/documents.api';
import type { DocumentPayload } from '../model/document.types';

export const documentKeys = {
  all: (condominiumId: string) => ['documents', condominiumId] as const,
  detail: (condominiumId: string, id: string) =>
    [...documentKeys.all(condominiumId), 'detail', id] as const,
  public: (slug: string) => ['documents', 'public', slug] as const,
  publicDetail: (slug: string, id: string) => [...documentKeys.public(slug), id] as const,
};

export function useDocumentsQuery(condominiumId: string) {
  return useQuery({
    queryKey: documentKeys.all(condominiumId),
    queryFn: () => documentsApi.list(condominiumId),
    enabled: Boolean(condominiumId),
  });
}

export function useDocumentQuery(condominiumId: string, id: string | undefined) {
  return useQuery({
    queryKey: documentKeys.detail(condominiumId, id ?? ''),
    queryFn: () => documentsApi.getById(condominiumId, id as string),
    enabled: Boolean(condominiumId) && Boolean(id),
  });
}

export function usePublicDocumentsQuery(slug: string | undefined) {
  return useQuery({
    queryKey: documentKeys.public(slug ?? ''),
    queryFn: () => documentsApi.listPublic(slug as string),
    enabled: Boolean(slug),
  });
}

export function usePublicDocumentQuery(slug: string | undefined, id: string | undefined) {
  return useQuery({
    queryKey: documentKeys.publicDetail(slug ?? '', id ?? ''),
    queryFn: () => documentsApi.getPublicById(slug as string, id as string),
    enabled: Boolean(slug) && Boolean(id),
  });
}

function useInvalidateDocuments(condominiumId: string) {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries({ queryKey: documentKeys.all(condominiumId) });
}

export function useCreateDocumentMutation(condominiumId: string) {
  const invalidate = useInvalidateDocuments(condominiumId);

  return useMutation({
    mutationFn: (payload: DocumentPayload) => documentsApi.create(condominiumId, payload),
    onSuccess: invalidate,
  });
}

interface UpdateDocumentInput {
  id: string;
  payload: Partial<DocumentPayload>;
}

export function useUpdateDocumentMutation(condominiumId: string) {
  const invalidate = useInvalidateDocuments(condominiumId);

  return useMutation({
    mutationFn: ({ id, payload }: UpdateDocumentInput) =>
      documentsApi.update(condominiumId, id, payload),
    onSuccess: invalidate,
  });
}

export function useDeleteDocumentMutation(condominiumId: string) {
  const invalidate = useInvalidateDocuments(condominiumId);

  return useMutation({
    mutationFn: (id: string) => documentsApi.remove(condominiumId, id),
    onSuccess: invalidate,
  });
}

export function useSyncDataInventoryMutation(condominiumId: string) {
  const invalidate = useInvalidateDocuments(condominiumId);

  return useMutation({
    mutationFn: () => documentsApi.syncDataInventory(condominiumId),
    onSuccess: invalidate,
  });
}
