export const SUGGESTION_STATUSES = ['NEW', 'READ'] as const;
export type SuggestionStatus = (typeof SUGGESTION_STATUSES)[number];

export const SUGGESTION_STATUS_LABELS: Record<SuggestionStatus, string> = {
  NEW: 'Nova',
  READ: 'Lida',
};

export interface Suggestion {
  id: string;
  unitNumber: string;
  authorName: string;
  body: string;
  status: SuggestionStatus;
  createdAt: string;
}

export interface VerifySuggestionPayload {
  unitNumber: string;
  cpf: string;
}

export interface VerifySuggestionResult {
  valid: boolean;
  unitNumber: string;
  authorNameHint: string;
}

export interface CreateSuggestionPayload {
  unitNumber: string;
  cpf: string;
  body: string;
  respectAndTransparencyCommitment: true;
}

export const RESPECT_COMMITMENT_TEXT =
  'Comprometo-me a escrever com respeito e transparência, em tom construtivo, visando o bem comum do condomínio e de seus moradores.';
