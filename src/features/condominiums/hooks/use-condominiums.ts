import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { saveFile } from '@/shared/utils/download-file';
import { condominiumsApi } from '../api/condominiums.api';
import type {
  AddCondoMemberPayload,
  CondominiumPayload,
  MembershipRole,
  UpdateCondominiumPayload,
} from '../model/condominium.types';
import type { PublicQrTarget } from '../model/public-qr.types';

export const condominiumKeys = {
  all: ['condominiums'] as const,
  mine: () => [...condominiumKeys.all, 'mine'] as const,
  detail: (id: string) => [...condominiumKeys.all, 'detail', id] as const,
  units: (id: string) => [...condominiumKeys.all, 'units', id] as const,
  members: (id: string) => [...condominiumKeys.all, 'members', id] as const,
  publicBySlug: (slug: string) => [...condominiumKeys.all, 'public', slug] as const,
  publicUnits: (slug: string) => [...condominiumKeys.all, 'public-units', slug] as const,
};

/** Condomínios em que o usuário autenticado tem algum vínculo. */
export function useMyCondominiumsQuery() {
  return useQuery({
    queryKey: condominiumKeys.mine(),
    queryFn: () => condominiumsApi.list(),
  });
}

export function useCondominiumQuery(id: string | undefined) {
  return useQuery({
    queryKey: condominiumKeys.detail(id ?? ''),
    queryFn: () => condominiumsApi.getById(id as string),
    enabled: Boolean(id),
  });
}

export function useCondominiumUnitsQuery(id: string | undefined) {
  return useQuery({
    queryKey: condominiumKeys.units(id ?? ''),
    queryFn: () => condominiumsApi.getUnits(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateCondominiumMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CondominiumPayload) => condominiumsApi.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: condominiumKeys.mine() }),
  });
}

interface UpdateCondominiumInput {
  id: string;
  payload: UpdateCondominiumPayload;
}

export function useUpdateCondominiumMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateCondominiumInput) => condominiumsApi.update(id, payload),
    onSuccess: (condominium) => {
      queryClient.invalidateQueries({ queryKey: condominiumKeys.mine() });
      queryClient.invalidateQueries({ queryKey: condominiumKeys.detail(condominium.id) });
      queryClient.invalidateQueries({
        queryKey: condominiumKeys.publicBySlug(condominium.slug),
      });
    },
  });
}

/** Perfil público do condomínio (hub `/c/:slug`), acessível sem login. */
export function usePublicCondominiumQuery(slug: string | undefined) {
  return useQuery({
    queryKey: condominiumKeys.publicBySlug(slug ?? ''),
    queryFn: () => condominiumsApi.getPublicBySlug(slug as string),
    enabled: Boolean(slug),
    retry: false,
  });
}

export function usePublicCondoUnitsQuery(slug: string | undefined) {
  return useQuery({
    queryKey: condominiumKeys.publicUnits(slug ?? ''),
    queryFn: () => condominiumsApi.getPublicUnits(slug as string),
    enabled: Boolean(slug),
  });
}

export function useCondoMembersQuery(condominiumId: string | undefined) {
  return useQuery({
    queryKey: condominiumKeys.members(condominiumId ?? ''),
    queryFn: () => condominiumsApi.listMembers(condominiumId as string),
    enabled: Boolean(condominiumId),
  });
}

export function useAddCondoMemberMutation(condominiumId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddCondoMemberPayload) =>
      condominiumsApi.addMember(condominiumId, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: condominiumKeys.members(condominiumId) }),
  });
}

interface UpdateMemberRoleInput {
  membershipId: string;
  role: MembershipRole;
}

export function useUpdateCondoMemberRoleMutation(condominiumId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ membershipId, role }: UpdateMemberRoleInput) =>
      condominiumsApi.updateMemberRole(condominiumId, membershipId, role),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: condominiumKeys.members(condominiumId) }),
  });
}

export function useRemoveCondoMemberMutation(condominiumId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (membershipId: string) =>
      condominiumsApi.removeMember(condominiumId, membershipId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: condominiumKeys.members(condominiumId) }),
  });
}

/** Baixa o PDF imprimível do QR Code de um destino público do condomínio. */
export function useDownloadPublicQrMutation(condominiumId: string) {
  return useMutation({
    mutationFn: (target: PublicQrTarget) =>
      condominiumsApi.downloadPublicQrPdf(condominiumId, target),
    onSuccess: (file) => saveFile(file),
  });
}
