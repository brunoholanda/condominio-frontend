import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { saveFile } from '@/shared/utils/download-file';
import { financeApi, transparencyApi } from '../api/finance.api';
import type { AttachmentType, PayableFilters, PayablePayload } from '../model/finance.types';

export const financeKeys = {
  all: (condominiumId: string) => ['payables', condominiumId] as const,
  list: (condominiumId: string, filters: PayableFilters) =>
    [...financeKeys.all(condominiumId), 'list', filters] as const,
  detail: (condominiumId: string, id: string) =>
    [...financeKeys.all(condominiumId), 'detail', id] as const,
  attachments: (condominiumId: string, id: string) =>
    [...financeKeys.all(condominiumId), 'attachments', id] as const,
};

export function usePayablesQuery(condominiumId: string, filters: PayableFilters) {
  return useQuery({
    queryKey: financeKeys.list(condominiumId, filters),
    queryFn: () => financeApi.list(condominiumId, filters),
    enabled: Boolean(condominiumId),
  });
}

export function usePayableQuery(condominiumId: string, id: string | undefined) {
  return useQuery({
    queryKey: financeKeys.detail(condominiumId, id ?? ''),
    queryFn: () => financeApi.getById(condominiumId, id as string),
    enabled: Boolean(condominiumId) && Boolean(id),
  });
}

function useInvalidatePayables(condominiumId: string) {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries({ queryKey: financeKeys.all(condominiumId) });
}

export function useCreatePayableMutation(condominiumId: string) {
  const invalidate = useInvalidatePayables(condominiumId);

  return useMutation({
    mutationFn: (payload: PayablePayload) => financeApi.create(condominiumId, payload),
    onSuccess: invalidate,
  });
}

interface UpdatePayableInput {
  id: string;
  payload: PayablePayload;
}

export function useUpdatePayableMutation(condominiumId: string) {
  const invalidate = useInvalidatePayables(condominiumId);

  return useMutation({
    mutationFn: ({ id, payload }: UpdatePayableInput) =>
      financeApi.update(condominiumId, id, payload),
    onSuccess: invalidate,
  });
}

interface ChangeStatusInput {
  id: string;
  note?: string;
}

export function useMarkPayableAsPaidMutation(condominiumId: string) {
  const invalidate = useInvalidatePayables(condominiumId);

  return useMutation({
    mutationFn: ({ id, note }: ChangeStatusInput) => financeApi.markAsPaid(condominiumId, id, note),
    onSuccess: invalidate,
  });
}

export function useCancelPayableMutation(condominiumId: string) {
  const invalidate = useInvalidatePayables(condominiumId);

  return useMutation({
    mutationFn: ({ id, note }: ChangeStatusInput) => financeApi.cancel(condominiumId, id, note),
    onSuccess: invalidate,
  });
}

export function usePayableAttachmentsQuery(condominiumId: string, payableId: string | undefined) {
  return useQuery({
    queryKey: financeKeys.attachments(condominiumId, payableId ?? ''),
    queryFn: () => financeApi.listAttachments(condominiumId, payableId as string),
    enabled: Boolean(condominiumId) && Boolean(payableId),
  });
}

interface UploadAttachmentInput {
  payableId: string;
  file: File;
  type: AttachmentType;
}

export function useUploadAttachmentMutation(condominiumId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ payableId, file, type }: UploadAttachmentInput) =>
      financeApi.uploadAttachment(condominiumId, payableId, file, type),
    onSuccess: (_data, variables) =>
      queryClient.invalidateQueries({
        queryKey: financeKeys.attachments(condominiumId, variables.payableId),
      }),
  });
}

interface DeleteAttachmentInput {
  payableId: string;
  attachmentId: string;
}

export function useDeleteAttachmentMutation(condominiumId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ payableId, attachmentId }: DeleteAttachmentInput) =>
      financeApi.deleteAttachment(condominiumId, payableId, attachmentId),
    onSuccess: (_data, variables) =>
      queryClient.invalidateQueries({
        queryKey: financeKeys.attachments(condominiumId, variables.payableId),
      }),
  });
}

interface DownloadAttachmentInput {
  payableId: string;
  attachmentId: string;
}

export function useDownloadAttachmentMutation(condominiumId: string) {
  return useMutation({
    mutationFn: ({ payableId, attachmentId }: DownloadAttachmentInput) =>
      financeApi.downloadAttachment(condominiumId, payableId, attachmentId),
    onSuccess: (file) => saveFile(file),
  });
}

export const transparencyKeys = {
  list: (slug: string, page: number) => ['transparency', slug, 'list', page] as const,
  detail: (slug: string, id: string) => ['transparency', slug, 'detail', id] as const,
};

export function useTransparencyPayablesQuery(slug: string | undefined, page: number) {
  return useQuery({
    queryKey: transparencyKeys.list(slug ?? '', page),
    queryFn: () => transparencyApi.list(slug as string, page),
    enabled: Boolean(slug),
  });
}

export function useTransparencyPayableQuery(slug: string | undefined, id: string | undefined) {
  return useQuery({
    queryKey: transparencyKeys.detail(slug ?? '', id ?? ''),
    queryFn: () => transparencyApi.getById(slug as string, id as string),
    enabled: Boolean(slug && id),
  });
}

export function useDownloadTransparencyAttachmentMutation(slug: string) {
  return useMutation({
    mutationFn: ({
      payableId,
      attachmentId,
    }: {
      payableId: string;
      attachmentId: string;
    }) => transparencyApi.downloadAttachment(slug, payableId, attachmentId),
    onSuccess: (file) => saveFile(file),
  });
}
