const BRL_FORMATTER = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const BRL_NUMBER_FORMATTER = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Formata um valor em centavos como "R$ 1.234,56". */
export function formatCentsToBRL(cents: number): string {
  return BRL_FORMATTER.format(cents / 100);
}

/** Formata reais como "1.234,56" (sem o prefixo R$). */
export function formatReaisMask(value: string | number | undefined | null): string {
  if (value === undefined || value === null || value === '') {
    return '';
  }

  const num = typeof value === 'number' ? value : Number(value);

  if (!Number.isFinite(num)) {
    return '';
  }

  return BRL_NUMBER_FORMATTER.format(num);
}

/**
 * Interpreta texto mascarado de moeda BR ("R$ 1.234,56", "1234,56", "1500")
 * como número em reais. Dígitos sem vírgula = reais inteiros (1500 → 1500).
 */
export function parseReaisMask(display: string | undefined | null): number {
  if (!display) {
    return Number.NaN;
  }

  const cleaned = display.replace(/R\$\s?/gi, '').trim();

  if (!cleaned) {
    return Number.NaN;
  }

  // Formato BR: ponto como milhar, vírgula como decimal.
  if (cleaned.includes(',')) {
    const normalized = cleaned.replace(/\./g, '').replace(',', '.');
    const num = Number(normalized);

    return Number.isFinite(num) ? num : Number.NaN;
  }

  // Sem vírgula: remove milhares e interpreta o restante como reais.
  const digits = cleaned.replace(/\./g, '').replace(/\D/g, '');

  if (!digits) {
    return Number.NaN;
  }

  const num = Number(digits);

  return Number.isFinite(num) ? num : Number.NaN;
}

/** Converte reais (podendo vir com vírgula) para centavos inteiros. */
export function reaisToCents(reais: number | string | undefined | null): number {
  if (typeof reais === 'string') {
    const parsed = parseReaisMask(reais);

    return Math.round((Number.isFinite(parsed) ? parsed : 0) * 100);
  }

  return Math.round((Number.isFinite(reais as number) ? (reais as number) : 0) * 100);
}

/** Converte centavos para reais, para preencher um `InputNumber`. */
export function centsToReais(cents: number | undefined | null): number {
  return (cents ?? 0) / 100;
}
