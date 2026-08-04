import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { contactsApi } from '../api/contacts.api';
import type { UsefulContactPayload } from '../model/contact.types';

export const contactKeys = {
  all: (condominiumId: string) => ['contacts', condominiumId] as const,
  public: (slug: string) => ['contacts', 'public', slug] as const,
};

export function useContactsQuery(condominiumId: string) {
  return useQuery({
    queryKey: contactKeys.all(condominiumId),
    queryFn: () => contactsApi.list(condominiumId),
    enabled: Boolean(condominiumId),
  });
}

export function usePublicContactsQuery(slug: string | undefined) {
  return useQuery({
    queryKey: contactKeys.public(slug ?? ''),
    queryFn: () => contactsApi.listPublic(slug as string),
    enabled: Boolean(slug),
  });
}

function useInvalidateContacts(condominiumId: string) {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries({ queryKey: contactKeys.all(condominiumId) });
}

export function useCreateContactMutation(condominiumId: string) {
  const invalidate = useInvalidateContacts(condominiumId);

  return useMutation({
    mutationFn: (payload: UsefulContactPayload) => contactsApi.create(condominiumId, payload),
    onSuccess: invalidate,
  });
}

interface UpdateContactInput {
  id: string;
  payload: Partial<UsefulContactPayload>;
}

export function useUpdateContactMutation(condominiumId: string) {
  const invalidate = useInvalidateContacts(condominiumId);

  return useMutation({
    mutationFn: ({ id, payload }: UpdateContactInput) =>
      contactsApi.update(condominiumId, id, payload),
    onSuccess: invalidate,
  });
}

export function useDeleteContactMutation(condominiumId: string) {
  const invalidate = useInvalidateContacts(condominiumId);

  return useMutation({
    mutationFn: (id: string) => contactsApi.remove(condominiumId, id),
    onSuccess: invalidate,
  });
}

export function useReorderContactsMutation(condominiumId: string) {
  const invalidate = useInvalidateContacts(condominiumId);

  return useMutation({
    mutationFn: (orderedIds: string[]) => contactsApi.reorder(condominiumId, orderedIds),
    onSuccess: invalidate,
  });
}
