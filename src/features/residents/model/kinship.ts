/** Sentinel option that lets the resident describe a relationship not listed. */
export const OTHER_KINSHIP = 'Outro';

/**
 * The API stores the relationship as free text, so the options carry their own
 * label as value and remain readable in the database and in reports.
 */
export const KINSHIP_OPTIONS = [
  'Cônjuge',
  'Companheiro(a)',
  'Filho(a)',
  'Enteado(a)',
  'Pai',
  'Mãe',
  'Sogro(a)',
  'Irmão(ã)',
  'Avô(ó)',
  'Neto(a)',
  'Tio(a)',
  'Sobrinho(a)',
  'Primo(a)',
  'Genro/Nora',
  'Cunhado(a)',
  'Agregado(a)',
  OTHER_KINSHIP,
] as const;

export function isListedKinship(value: string): boolean {
  return KINSHIP_OPTIONS.some((option) => option === value);
}
