import { Input, type InputProps } from 'antd';
import { useEffect, useState } from 'react';

import { formatReaisMask, parseReaisMask } from '@/shared/utils/currency';

type MoneyInputProps = Omit<InputProps, 'value' | 'onChange' | 'type' | 'prefix'> & {
  value?: number | null;
  onChange?: (value: number | null) => void;
  min?: number;
  /** Mostra o prefixo "R$" (padrão: true). */
  showPrefix?: boolean;
  prefix?: InputProps['prefix'];
};

function clampMin(num: number, min: number | undefined): number {
  if (min == null || !Number.isFinite(min)) {
    return num;
  }

  return Math.max(min, num);
}

function toEditableText(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value) || value === 0) {
    return '';
  }

  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace('.', ',');
}

function toDisplayText(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) {
    return '';
  }

  return formatReaisMask(value);
}

/** Mantém só dígitos, um separador decimal e pontos de milhar. */
function sanitizeMoneyTyping(raw: string): string {
  const cleaned = raw.replace(/R\$\s?/gi, '').replace(/[^\d.,]/g, '');
  const hasComma = cleaned.includes(',');

  if (!hasComma) {
    return cleaned;
  }

  const firstComma = cleaned.indexOf(',');
  const before = cleaned.slice(0, firstComma).replace(/,/g, '');
  const after = cleaned.slice(firstComma + 1).replace(/[^\d]/g, '').slice(0, 2);

  return `${before},${after}`;
}

/**
 * Campo monetário BR estável (sem InputNumber).
 * Digite `1500` → R$ 1.500,00; use vírgula para centavos (`1500,50`).
 */
export function MoneyInput({
  value,
  onChange,
  min = 0,
  showPrefix = true,
  prefix,
  disabled,
  placeholder = '0,00',
  onFocus,
  onBlur,
  ...props
}: MoneyInputProps) {
  const [focused, setFocused] = useState(false);
  const [text, setText] = useState(() => toDisplayText(value));

  useEffect(() => {
    if (focused) {
      return;
    }

    setText(toDisplayText(value));
  }, [focused, value]);

  const emit = (raw: string) => {
    const parsed = parseReaisMask(raw);

    if (!Number.isFinite(parsed)) {
      onChange?.(null);
      return null;
    }

    const next = clampMin(parsed, min);
    onChange?.(next);
    return next;
  };

  return (
    <Input
      {...props}
      disabled={disabled}
      inputMode="decimal"
      autoComplete="off"
      placeholder={placeholder}
      prefix={showPrefix ? (prefix ?? 'R$') : prefix}
      value={text}
      onFocus={(event) => {
        setFocused(true);
        setText(toEditableText(value));
        onFocus?.(event);
      }}
      onBlur={(event) => {
        setFocused(false);
        const next = emit(text);
        setText(next == null ? '' : formatReaisMask(next));
        onBlur?.(event);
      }}
      onChange={(event) => {
        const nextText = sanitizeMoneyTyping(event.target.value);
        setText(nextText);

        if (!nextText.trim()) {
          onChange?.(null);
          return;
        }

        emit(nextText);
      }}
    />
  );
}
