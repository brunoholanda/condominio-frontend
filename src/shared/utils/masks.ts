export function onlyDigits(value: string | undefined | null): string {
  return (value ?? '').replace(/\D/g, '');
}

export function onlyAlphanumeric(value: string | undefined | null): string {
  return (value ?? '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
}

export function maskCpf(value: string | undefined): string {
  const digits = onlyDigits(value).slice(0, 11);

  return digits
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d{1,2})$/, '.$1-$2');
}

/** Formats landlines as (11) 3333-4444 and mobiles as (11) 98888-7777. */
export function maskPhone(value: string | undefined): string {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length <= 2) {
    return digits.replace(/^(\d{0,2})/, '($1');
  }

  const areaCode = `(${digits.slice(0, 2)}) `;
  const rest = digits.slice(2);
  const splitAt = rest.length > 8 ? 5 : 4;

  return rest.length <= splitAt
    ? `${areaCode}${rest}`
    : `${areaCode}${rest.slice(0, splitAt)}-${rest.slice(splitAt)}`;
}

/** Accepts both the legacy (ABC-1234) and the Mercosul (ABC-1D23) layouts. */
export function maskPlate(value: string | undefined): string {
  const characters = onlyAlphanumeric(value).slice(0, 7);

  return characters.length > 3 ? `${characters.slice(0, 3)}-${characters.slice(3)}` : characters;
}

export function maskRg(value: string | undefined): string {
  return (value ?? '').replace(/[^0-9A-Za-z.\-/]/g, '').slice(0, 20);
}
