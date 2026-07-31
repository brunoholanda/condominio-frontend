import type { Rule } from 'antd/es/form';

import { isValidCpf, isValidPhone, isValidPlate } from './brazilian-validators';

/** Reusable Ant Design validation rules, so the messages stay consistent. */
export const rules = {
  required: (message = 'Campo obrigatório'): Rule => ({ required: true, message }),

  text: (min: number, max: number): Rule => ({
    min,
    max,
    message: `Informe entre ${min} e ${max} caracteres`,
  }),

  email: (): Rule => ({ type: 'email', message: 'Informe um e-mail válido' }),

  cpf: (): Rule => ({
    validator: (_rule, value: string | undefined) =>
      !value || isValidCpf(value) ? Promise.resolve() : Promise.reject(new Error('CPF inválido')),
  }),

  phone: (): Rule => ({
    validator: (_rule, value: string | undefined) =>
      !value || isValidPhone(value)
        ? Promise.resolve()
        : Promise.reject(new Error('Telefone inválido. Informe DDD + número')),
  }),

  plate: (): Rule => ({
    validator: (_rule, value: string | undefined) =>
      !value || isValidPlate(value)
        ? Promise.resolve()
        : Promise.reject(new Error('Placa inválida (ABC-1234 ou ABC-1D23)')),
  }),

  accepted: (message: string): Rule => ({
    validator: (_rule, value: boolean | undefined) =>
      value === true ? Promise.resolve() : Promise.reject(new Error(message)),
  }),
} as const;
