/** Dias da semana usados na jornada (ordem segunda → domingo). */
export const WORK_DAYS = [
  { key: 'seg', label: 'Seg', full: 'Segunda' },
  { key: 'ter', label: 'Ter', full: 'Terça' },
  { key: 'qua', label: 'Qua', full: 'Quarta' },
  { key: 'qui', label: 'Qui', full: 'Quinta' },
  { key: 'sex', label: 'Sex', full: 'Sexta' },
  { key: 'sab', label: 'Sáb', full: 'Sábado' },
  { key: 'dom', label: 'Dom', full: 'Domingo' },
] as const;

export type WorkDayKey = (typeof WORK_DAYS)[number]['key'];

export interface WorkScheduleParts {
  days: WorkDayKey[];
  start: string; // HH:mm
  end: string; // HH:mm
}

export interface WorkSchedulePreset {
  id: string;
  label: string;
  parts: WorkScheduleParts;
}

export const WORK_SCHEDULE_PRESETS: WorkSchedulePreset[] = [
  {
    id: 'comercial',
    label: 'Comercial',
    parts: { days: ['seg', 'ter', 'qua', 'qui', 'sex'], start: '08:00', end: '17:00' },
  },
  {
    id: 'manha',
    label: 'Manhã',
    parts: { days: ['seg', 'ter', 'qua', 'qui', 'sex'], start: '06:00', end: '14:00' },
  },
  {
    id: 'tarde',
    label: 'Tarde',
    parts: { days: ['seg', 'ter', 'qua', 'qui', 'sex'], start: '14:00', end: '22:00' },
  },
  {
    id: 'noite',
    label: 'Noite',
    parts: { days: ['seg', 'ter', 'qua', 'qui', 'sex'], start: '22:00', end: '06:00' },
  },
  {
    id: 'fins-semana',
    label: 'Fins de semana',
    parts: { days: ['sab', 'dom'], start: '08:00', end: '17:00' },
  },
];

const DAY_ALIASES: Record<string, WorkDayKey> = {
  seg: 'seg',
  segunda: 'seg',
  'segunda-feira': 'seg',
  ter: 'ter',
  terca: 'ter',
  terça: 'ter',
  'terca-feira': 'ter',
  'terça-feira': 'ter',
  qua: 'qua',
  quarta: 'qua',
  'quarta-feira': 'qua',
  qui: 'qui',
  quinta: 'qui',
  'quinta-feira': 'qui',
  sex: 'sex',
  sexta: 'sex',
  'sexta-feira': 'sex',
  sab: 'sab',
  sabado: 'sab',
  sábado: 'sab',
  dom: 'dom',
  domingo: 'dom',
};

const DAY_ORDER = WORK_DAYS.map((d) => d.key);

function dayIndex(key: WorkDayKey): number {
  return DAY_ORDER.indexOf(key);
}

function formatTimeLabel(hhmm: string): string {
  const [h, m] = hhmm.split(':');
  if (m === '00') return `${h}h`;
  return `${h}h${m}`;
}

/** Agrupa dias consecutivos: Seg–Sex / Seg, Qua, Sex. */
export function formatDaysLabel(days: WorkDayKey[]): string {
  if (days.length === 0) return '';

  const sorted = [...days].sort((a, b) => dayIndex(a) - dayIndex(b));
  const labels = sorted.map((key) => WORK_DAYS.find((d) => d.key === key)!.label);

  const ranges: string[] = [];
  let rangeStart = 0;

  for (let i = 1; i <= sorted.length; i += 1) {
    const prev = sorted[i - 1]!;
    const curr = sorted[i];
    const consecutive = curr != null && dayIndex(curr) === dayIndex(prev) + 1;

    if (consecutive) continue;

    const startLabel = labels[rangeStart]!;
    const endLabel = labels[i - 1]!;
    ranges.push(rangeStart === i - 1 ? startLabel : `${startLabel}–${endLabel}`);
    rangeStart = i;
  }

  return ranges.join(', ');
}

/** Monta o texto salvo no backend, ex.: "Seg–Sex 08h–17h". */
export function formatWorkSchedule(parts: WorkScheduleParts): string {
  const daysLabel = formatDaysLabel(parts.days);
  if (!daysLabel || !parts.start || !parts.end) return '';

  return `${daysLabel} ${formatTimeLabel(parts.start)}–${formatTimeLabel(parts.end)}`;
}

function normalizeTimeToken(raw: string): string | null {
  const cleaned = raw.trim().toLowerCase().replace(/\s/g, '');
  const match = cleaned.match(/^(\d{1,2})(?:[:h](\d{2}))?h?$/);
  if (!match) return null;

  const hour = Number(match[1]);
  const minute = Number(match[2] ?? '0');
  if (!Number.isFinite(hour) || hour > 23 || minute > 59) return null;

  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function expandDayRange(from: WorkDayKey, to: WorkDayKey): WorkDayKey[] {
  const start = dayIndex(from);
  const end = dayIndex(to);
  if (start < 0 || end < 0 || end < start) return [from, to];
  return DAY_ORDER.slice(start, end + 1);
}

/**
 * Tenta interpretar textos comuns de jornada.
 * Retorna null se o formato não for reconhecido (mantém modo texto livre).
 */
export function parseWorkSchedule(value: string | null | undefined): WorkScheduleParts | null {
  if (!value?.trim()) return null;

  const text = value.trim().toLowerCase().replace(/\s+/g, ' ');
  const timeMatch = text.match(/(\d{1,2}(?:[:h]\d{2})?h?)\s*[–\-àa]\s*(\d{1,2}(?:[:h]\d{2})?h?)/i);
  if (!timeMatch) return null;

  const start = normalizeTimeToken(timeMatch[1]!);
  const end = normalizeTimeToken(timeMatch[2]!);
  if (!start || !end) return null;

  const daysPart = text.slice(0, timeMatch.index).trim().replace(/[,/]+/g, ',');
  if (!daysPart) return null;

  const days = new Set<WorkDayKey>();

  for (const chunk of daysPart.split(',')) {
    const piece = chunk.trim();
    if (!piece) continue;

    const range = piece.split(/\s*[–\-]\s*/);
    if (range.length === 2) {
      const from = DAY_ALIASES[range[0]!.trim()];
      const to = DAY_ALIASES[range[1]!.trim()];
      if (from && to) {
        expandDayRange(from, to).forEach((d) => days.add(d));
        continue;
      }
    }

    const single = DAY_ALIASES[piece];
    if (single) days.add(single);
  }

  if (days.size === 0) return null;

  return {
    days: DAY_ORDER.filter((d) => days.has(d)),
    start,
    end,
  };
}

export const EMPTY_WORK_SCHEDULE: WorkScheduleParts = {
  days: ['seg', 'ter', 'qua', 'qui', 'sex'],
  start: '08:00',
  end: '17:00',
};
