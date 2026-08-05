import { Button, TimePicker } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';

import {
  EMPTY_WORK_SCHEDULE,
  WORK_DAYS,
  WORK_SCHEDULE_PRESETS,
  formatWorkSchedule,
  parseWorkSchedule,
  type WorkDayKey,
  type WorkScheduleParts,
} from '../model/work-schedule';
import * as S from './WorkScheduleInput.styles';

const TIME_FORMAT = 'HH:mm';

interface WorkScheduleInputProps {
  value?: string | null;
  onChange?: (value: string | undefined) => void;
  disabled?: boolean;
}

function toDayjs(hhmm: string): Dayjs {
  return dayjs(hhmm, TIME_FORMAT);
}

/** Monta a jornada com dias + horário (grava string legível no backend). */
export function WorkScheduleInput({ value, onChange, disabled }: WorkScheduleInputProps) {
  const parsed = parseWorkSchedule(value);
  const [freeTextMode, setFreeTextMode] = useState(() => Boolean(value?.trim()) && !parsed);
  const [parts, setParts] = useState<WorkScheduleParts>(() => parsed ?? EMPTY_WORK_SCHEDULE);

  useEffect(() => {
    const next = parseWorkSchedule(value);
    if (next) {
      setParts(next);
      setFreeTextMode(false);
      return;
    }

    if (value?.trim()) {
      setFreeTextMode(true);
    }
  }, [value]);

  const emitParts = (next: WorkScheduleParts) => {
    setParts(next);
    const formatted = formatWorkSchedule(next);
    onChange?.(formatted || undefined);
  };

  const toggleDay = (day: WorkDayKey) => {
    const selected = parts.days.includes(day);
    const days = selected ? parts.days.filter((d) => d !== day) : [...parts.days, day];
    emitParts({ ...parts, days });
  };

  const applyPreset = (presetId: string) => {
    const preset = WORK_SCHEDULE_PRESETS.find((item) => item.id === presetId);
    if (!preset) return;
    setFreeTextMode(false);
    emitParts(preset.parts);
  };

  if (freeTextMode) {
    return (
      <S.Root>
        <S.Toolbar>
          <S.Hint>Texto livre — útil para escalas 12×36 ou plantões irregulares.</S.Hint>
          <Button
            type="link"
            size="small"
            disabled={disabled}
            onClick={() => {
              setFreeTextMode(false);
              emitParts(parts.days.length ? parts : EMPTY_WORK_SCHEDULE);
            }}
          >
            Usar seletor
          </Button>
        </S.Toolbar>
        <S.FreeText
          value={value ?? ''}
          disabled={disabled}
          placeholder="Ex.: 12×36 — 07h–19h (dias alternados)"
          onChange={(event) => onChange?.(event.target.value || undefined)}
        />
      </S.Root>
    );
  }

  const preview = formatWorkSchedule(parts);

  return (
    <S.Root>
      <S.Presets>
        {WORK_SCHEDULE_PRESETS.map((preset) => (
          <S.PresetChip
            key={preset.id}
            type="button"
            disabled={disabled}
            $active={formatWorkSchedule(preset.parts) === preview}
            onClick={() => applyPreset(preset.id)}
          >
            {preset.label}
          </S.PresetChip>
        ))}
      </S.Presets>

      <S.Days role="group" aria-label="Dias da semana">
        {WORK_DAYS.map((day) => {
          const active = parts.days.includes(day.key);

          return (
            <S.DayButton
              key={day.key}
              type="button"
              disabled={disabled}
              $active={active}
              aria-pressed={active}
              title={day.full}
              onClick={() => toggleDay(day.key)}
            >
              {day.label}
            </S.DayButton>
          );
        })}
      </S.Days>

      <S.Times>
        <S.TimeField>
          <S.TimeLabel>Entrada</S.TimeLabel>
          <TimePicker
            value={toDayjs(parts.start)}
            format={TIME_FORMAT}
            minuteStep={15}
            needConfirm={false}
            allowClear={false}
            disabled={disabled}
            style={{ width: '100%' }}
            onChange={(time) => {
              if (!time) return;
              emitParts({ ...parts, start: time.format(TIME_FORMAT) });
            }}
          />
        </S.TimeField>
        <S.TimeField>
          <S.TimeLabel>Saída</S.TimeLabel>
          <TimePicker
            value={toDayjs(parts.end)}
            format={TIME_FORMAT}
            minuteStep={15}
            needConfirm={false}
            allowClear={false}
            disabled={disabled}
            style={{ width: '100%' }}
            onChange={(time) => {
              if (!time) return;
              emitParts({ ...parts, end: time.format(TIME_FORMAT) });
            }}
          />
        </S.TimeField>
      </S.Times>

      <S.Footer>
        <S.Preview>{preview || 'Selecione os dias e o horário'}</S.Preview>
        <Button type="link" size="small" disabled={disabled} onClick={() => setFreeTextMode(true)}>
          Texto livre
        </Button>
      </S.Footer>
    </S.Root>
  );
}
