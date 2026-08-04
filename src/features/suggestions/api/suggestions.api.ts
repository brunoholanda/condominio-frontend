import { httpClient } from '@/shared/api/http-client';
import type {
  CreateSuggestionPayload,
  Suggestion,
  SuggestionStatus,
  VerifySuggestionPayload,
  VerifySuggestionResult,
} from '../model/suggestion.types';

export const suggestionsApi = {
  async verify(slug: string, payload: VerifySuggestionPayload): Promise<VerifySuggestionResult> {
    const { data } = await httpClient.post<VerifySuggestionResult>(
      `/c/${slug}/suggestions/verify`,
      payload,
    );

    return data;
  },

  async create(slug: string, payload: CreateSuggestionPayload): Promise<Suggestion> {
    const { data } = await httpClient.post<Suggestion>(`/c/${slug}/suggestions`, payload);

    return data;
  },

  async list(condominiumId: string, status?: SuggestionStatus): Promise<Suggestion[]> {
    const { data } = await httpClient.get<Suggestion[]>(
      `/condominiums/${condominiumId}/suggestions`,
      { params: status ? { status } : undefined },
    );

    return data;
  },

  async markAsRead(condominiumId: string, id: string): Promise<Suggestion> {
    const { data } = await httpClient.post<Suggestion>(
      `/condominiums/${condominiumId}/suggestions/${id}/read`,
    );

    return data;
  },
};
