import { InputNumber, type InputNumberProps } from 'antd';

import { formatReaisMask, parseReaisMask } from '@/shared/utils/currency';

type MoneyInputProps = Omit<
  InputNumberProps<number>,
  'formatter' | 'parser' | 'decimalSeparator' | 'precision' | 'step'
> & {
  /** Mostra o prefixo "R$" (padrão: true). */
  showPrefix?: boolean;
};

/** Campo monetário BR: digita centavos e exibe `1.234,56`. */
export function MoneyInput({ showPrefix = true, min = 0, style, ...props }: MoneyInputProps) {
  return (
    <InputNumber<number>
      {...props}
      min={min}
      step={0.01}
      precision={2}
      controls={props.controls ?? false}
      style={{ width: '100%', ...style }}
      prefix={showPrefix ? (props.prefix ?? 'R$') : props.prefix}
      formatter={(value) => formatReaisMask(value)}
      parser={(display) => {
        const parsed = parseReaisMask(display);

        return (Number.isFinite(parsed) ? parsed : 0) as unknown as number;
      }}
    />
  );
}
