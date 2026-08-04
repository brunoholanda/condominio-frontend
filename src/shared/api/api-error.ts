import axios from 'axios';

interface ApiErrorBody {
  message?: string | string[];
  error?: string;
  field?: string;
  code?: string;
}

/** Normalized transport error so the UI never has to inspect Axios internals. */
export class ApiError extends Error {
  readonly status: number | undefined;
  readonly field: string | undefined;
  readonly code: string | undefined;

  constructor(message: string, status?: number, field?: string, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.field = field;
    this.code = code;
  }
}

const FALLBACK_MESSAGE = 'Não foi possível concluir a operação. Tente novamente.';

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (!axios.isAxiosError<ApiErrorBody>(error)) {
    return new ApiError(FALLBACK_MESSAGE);
  }

  if (!error.response) {
    return new ApiError('Servidor indisponível. Verifique sua conexão e tente novamente.');
  }

  const { message, field, code } = error.response.data ?? {};
  const description = Array.isArray(message) ? message.join(' • ') : message;

  return new ApiError(description || FALLBACK_MESSAGE, error.response.status, field, code);
}
