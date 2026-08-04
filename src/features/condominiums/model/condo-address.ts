/** Unidades federativas do Brasil (código e nome). */
export const BRAZIL_STATES = [
  { value: 'AC', label: 'AC — Acre' },
  { value: 'AL', label: 'AL — Alagoas' },
  { value: 'AP', label: 'AP — Amapá' },
  { value: 'AM', label: 'AM — Amazonas' },
  { value: 'BA', label: 'BA — Bahia' },
  { value: 'CE', label: 'CE — Ceará' },
  { value: 'DF', label: 'DF — Distrito Federal' },
  { value: 'ES', label: 'ES — Espírito Santo' },
  { value: 'GO', label: 'GO — Goiás' },
  { value: 'MA', label: 'MA — Maranhão' },
  { value: 'MT', label: 'MT — Mato Grosso' },
  { value: 'MS', label: 'MS — Mato Grosso do Sul' },
  { value: 'MG', label: 'MG — Minas Gerais' },
  { value: 'PA', label: 'PA — Pará' },
  { value: 'PB', label: 'PB — Paraíba' },
  { value: 'PR', label: 'PR — Paraná' },
  { value: 'PE', label: 'PE — Pernambuco' },
  { value: 'PI', label: 'PI — Piauí' },
  { value: 'RJ', label: 'RJ — Rio de Janeiro' },
  { value: 'RN', label: 'RN — Rio Grande do Norte' },
  { value: 'RS', label: 'RS — Rio Grande do Sul' },
  { value: 'RO', label: 'RO — Rondônia' },
  { value: 'RR', label: 'RR — Roraima' },
  { value: 'SC', label: 'SC — Santa Catarina' },
  { value: 'SP', label: 'SP — São Paulo' },
  { value: 'SE', label: 'SE — Sergipe' },
  { value: 'TO', label: 'TO — Tocantins' },
] as const;

export type BrazilUf = (typeof BRAZIL_STATES)[number]['value'];

export interface CondoAddressParts {
  street?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

/** Monta o endereço único persistido no condomínio. */
export function formatCondoAddress(parts: CondoAddressParts): string {
  const line1 = [parts.street?.trim(), parts.number?.trim()].filter(Boolean).join(', ');
  const cityUf = [parts.city?.trim(), parts.state?.trim()].filter(Boolean).join(' - ');
  const mid = [parts.neighborhood?.trim(), cityUf].filter(Boolean).join(', ');
  const cep = parts.zipCode?.trim() ? `CEP ${parts.zipCode.trim()}` : '';

  return [line1, mid, cep].filter(Boolean).join(' — ').slice(0, 255);
}

/**
 * Tenta extrair partes de um endereço já salvo no formato
 * "Rua, N — Bairro, Cidade - UF — CEP 00000-000".
 */
export function parseCondoAddress(raw?: string | null): CondoAddressParts {
  if (!raw?.trim()) return {};

  const text = raw.trim();
  const cepMatch = text.match(/CEP\s*(\d{5}-?\d{3})/i);
  const zipCode = cepMatch?.[1]
    ? cepMatch[1].includes('-')
      ? cepMatch[1]
      : `${cepMatch[1].slice(0, 5)}-${cepMatch[1].slice(5)}`
    : undefined;

  const withoutCep = text.replace(/\s*—?\s*CEP\s*\d{5}-?\d{3}/i, '').trim();
  const segments = withoutCep.split(/\s*—\s*/).map((s) => s.trim()).filter(Boolean);

  let street: string | undefined;
  let number: string | undefined;
  let neighborhood: string | undefined;
  let city: string | undefined;
  let state: string | undefined;

  const firstSeg = segments[0];
  if (firstSeg) {
    const [streetPart, ...restNum] = firstSeg.split(',').map((s) => s.trim());
    street = streetPart || undefined;
    number = restNum.join(', ') || undefined;
  }

  const citySeg = segments[1];
  if (citySeg) {
    const ufMatch = citySeg.match(/\b([A-Z]{2})\b\s*$/);
    state = ufMatch?.[1];
    const beforeUf = state ? citySeg.replace(/\s*-\s*[A-Z]{2}\s*$/, '').trim() : citySeg;
    const [neigh, ...cityParts] = beforeUf.split(',').map((s) => s.trim());

    if (cityParts.length > 0) {
      neighborhood = neigh || undefined;
      city = cityParts.join(', ') || undefined;
    } else {
      city = neigh || undefined;
    }
  }

  if (!street && !city) {
    return { street: text.slice(0, 120), zipCode };
  }

  return { street, number, neighborhood, city, state, zipCode };
}
