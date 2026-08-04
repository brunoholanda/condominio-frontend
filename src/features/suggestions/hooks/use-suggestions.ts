import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { suggestionsApi } from '../api/suggestions.api';
import type {
  CreateSuggestionPayload,
  SuggestionStatus,
  VerifySuggestionPayload,
} from '../model/suggestion.types';

export const suggestionKeys = {
  all: ['suggestions'] as const,
  list: (condoId: string, status?: SuggestionStatus) =>
    [...suggestionKeys.all, 'list', condoId, status ?? 'all'] as const,
};

export function useVerifySuggestionMutation(slug: string) {
  return useMutation({
    mutationFn: (payload: VerifySuggestionPayload) => suggestionsApi.verify(slug, payload),
  });
}

export function useCreateSuggestionMutation(slug: string) {
  return useMutation({
    mutationFn: (payload: CreateSuggestionPayload) => suggestionsApi.create(slug, payload),
  });
}

export function useSuggestionsQuery(condominiumId: string, status?: SuggestionStatus) {
  return useQuery({
    queryKey: suggestionKeys.list(condominiumId, status),
    queryFn: () => suggestionsApi.list(condominiumId, status),
  });
}

export function useMarkSuggestionReadMutation(condominiumId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => suggestionsApi.markAsRead(condominiumId, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: suggestionKeys.all }),
  });
}
