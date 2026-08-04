import { Input, type InputProps } from 'antd';

/** Campo de telefone com teclado numérico e limite da máscara BR `(11) 98888-7777`. */
export function PhoneInput({ placeholder = '(11) 98888-7777', ...props }: InputProps) {
  return (
    <Input
      {...props}
      inputMode="tel"
      autoComplete="tel"
      maxLength={15}
      placeholder={placeholder}
    />
  );
}
