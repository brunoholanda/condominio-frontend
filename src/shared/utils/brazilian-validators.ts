import { onlyAlphanumeric, onlyDigits } from './masks';

const CPF_LENGTH = 11;
const LEGACY_PLATE = /^[A-Z]{3}\d{4}$/;
const MERCOSUL_PLATE = /^[A-Z]{3}\d[A-Z]\d{2}$/;

function cpfCheckDigit(digits: string, length: number): number {
  let sum = 0;

  for (let index = 0; index < length; index += 1) {
    sum += Number(digits[index]) * (length + 1 - index);
  }

  const remainder = (sum * 10) % CPF_LENGTH;

  return remainder === 10 ? 0 : remainder;
}

/** Mirrors the server-side rule so the user gets feedback before submitting. */
export function isValidCpf(value: string | undefined): boolean {
  const digits = onlyDigits(value);

  if (digits.length !== CPF_LENGTH || /^(\d)\1{10}$/.test(digits)) {
    return false;
  }

  return (
    cpfCheckDigit(digits, 9) === Number(digits[9]) &&
    cpfCheckDigit(digits, 10) === Number(digits[10])
  );
}

export function isValidPhone(value: string | undefined): boolean {
  const digits = onlyDigits(value);

  if (digits.length !== 10 && digits.length !== 11) {
    return false;
  }

  const areaCode = Number(digits.slice(0, 2));

  if (areaCode < 11 || areaCode > 99) {
    return false;
  }

  return digits.length === 11 ? digits[2] === '9' : /^[2-5]/.test(digits.slice(2));
}

export function isValidPlate(value: string | undefined): boolean {
  const normalized = onlyAlphanumeric(value);

  return LEGACY_PLATE.test(normalized) || MERCOSUL_PLATE.test(normalized);
}
