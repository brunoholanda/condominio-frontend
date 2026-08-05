export const CONTRACT_TYPES = ['CLT', 'PJ', 'ESTAGIO', 'TEMPORARIO'] as const;
export type ContractType = (typeof CONTRACT_TYPES)[number];

export const CONTRACT_TYPE_LABELS: Record<ContractType, string> = {
  CLT: 'CLT',
  PJ: 'PJ',
  ESTAGIO: 'Estágio',
  TEMPORARIO: 'Temporário',
};

export const ACCOUNT_TYPES = ['CORRENTE', 'POUPANCA'] as const;
export type AccountType = (typeof ACCOUNT_TYPES)[number];

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  CORRENTE: 'Corrente',
  POUPANCA: 'Poupança',
};

export const PUNCH_TYPES = ['CLOCK_IN', 'BREAK_START', 'BREAK_END', 'CLOCK_OUT'] as const;
export type PunchType = (typeof PUNCH_TYPES)[number];

export const PUNCH_TYPE_LABELS: Record<PunchType, string> = {
  CLOCK_IN: 'Entrada',
  BREAK_START: 'Início do intervalo',
  BREAK_END: 'Fim do intervalo',
  CLOCK_OUT: 'Saída',
};

export const PUNCH_STATUSES = ['ACCEPTED', 'REJECTED'] as const;
export type PunchStatus = (typeof PUNCH_STATUSES)[number];

export interface EmployeeBenefit {
  name: string;
  value?: number | null;
}

export interface EmployeeListItem {
  id: string;
  fullName: string;
  cpf: string;
  jobTitle: string;
  department: string | null;
  isActive: boolean;
  phone: string | null;
}

export interface Employee {
  id: string;
  condominiumId: string;
  fullName: string;
  cpf: string;
  rg: string | null;
  birthDate: string | null;
  gender: string | null;
  maritalStatus: string | null;
  nationality: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  jobTitle: string;
  department: string | null;
  admissionDate: string | null;
  contractType: ContractType;
  workSchedule: string | null;
  notes: string | null;
  salary: number | null;
  benefits: EmployeeBenefit[];
  bankName: string | null;
  bankCode: string | null;
  agency: string | null;
  accountNumber: string | null;
  accountType: AccountType | null;
  pixKey: string | null;
  isActive: boolean;
  canAccessTimeClock: boolean;
  canAccessVisitors: boolean;
  canAccessDeliveries: boolean;
  hasPin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeePayload {
  fullName: string;
  cpf: string;
  rg?: string | null;
  birthDate?: string | null;
  gender?: string | null;
  maritalStatus?: string | null;
  nationality?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  jobTitle: string;
  department?: string | null;
  admissionDate?: string | null;
  contractType?: ContractType;
  workSchedule?: string | null;
  notes?: string | null;
  salary?: number | null;
  benefits?: EmployeeBenefit[];
  bankName?: string | null;
  bankCode?: string | null;
  agency?: string | null;
  accountNumber?: string | null;
  accountType?: AccountType | null;
  pixKey?: string | null;
  pin?: string;
  isActive?: boolean;
  canAccessTimeClock?: boolean;
  canAccessVisitors?: boolean;
  canAccessDeliveries?: boolean;
}

export interface TimePunch {
  id: string;
  condominiumId: string;
  employeeId: string;
  employeeName?: string;
  type: PunchType;
  status: PunchStatus;
  punchedAt: string;
  latitude: number;
  longitude: number;
  accuracyMeters: number | null;
  distanceMeters: number;
  hasSelfie: boolean;
  rejectedReason: string | null;
  createdAt: string;
}

export interface PunchFilters {
  from?: string;
  to?: string;
  employeeId?: string;
  status?: PunchStatus;
}

export interface StaffLoginResponse {
  accessToken: string;
  expiresInSeconds: number;
  employeeId: string;
  fullName: string;
  condominiumName: string;
}

export interface StaffMe {
  employeeId: string;
  fullName: string;
  jobTitle: string;
  condominiumName: string;
  lastPunchType: PunchType | null;
  nextPunchType: PunchType;
  geofenceRadiusMeters: number;
  canAccessTimeClock: boolean;
  canAccessVisitors: boolean;
  canAccessDeliveries: boolean;
  condominiumSlug?: string;
  unitNumbers: string[];
}

export const ABSENCE_REASONS = [
  'ATESTADO_MEDICO',
  'ATESTADO_ODONTOLOGICO',
  'CONSULTA_MEDICA',
  'LICENCA_MATERNIDADE',
  'LICENCA_PATERNIDADE',
  'FALECIMENTO_FAMILIAR',
  'CASAMENTO',
  'DOACAO_SANGUE',
  'COMPARECIMENTO_JUDICIAL',
  'SERVICO_ELEITORAL',
  'ACIDENTE_TRABALHO',
  'FOLGA_COMPENSATORIA',
  'FERIAS',
  'LICENCA_PREMIO',
  'AFASTAMENTO_INSS',
  'DECLARACAO_ESCOLAR',
  'SUSPENSAO',
  'FALTA_JUSTIFICADA_OUTROS',
  'FALTA_INJUSTIFICADA',
] as const;

export type AbsenceReason = (typeof ABSENCE_REASONS)[number];

export const ABSENCE_REASON_LABELS: Record<AbsenceReason, string> = {
  ATESTADO_MEDICO: 'Atestado médico',
  ATESTADO_ODONTOLOGICO: 'Atestado odontológico',
  CONSULTA_MEDICA: 'Consulta médica / exame',
  LICENCA_MATERNIDADE: 'Licença-maternidade',
  LICENCA_PATERNIDADE: 'Licença-paternidade',
  FALECIMENTO_FAMILIAR: 'Falecimento de familiar',
  CASAMENTO: 'Casamento',
  DOACAO_SANGUE: 'Doação de sangue',
  COMPARECIMENTO_JUDICIAL: 'Comparecimento judicial',
  SERVICO_ELEITORAL: 'Serviço eleitoral',
  ACIDENTE_TRABALHO: 'Acidente de trabalho',
  FOLGA_COMPENSATORIA: 'Folga compensatória',
  FERIAS: 'Férias',
  LICENCA_PREMIO: 'Licença-prêmio',
  AFASTAMENTO_INSS: 'Afastamento INSS',
  DECLARACAO_ESCOLAR: 'Declaração escolar / acompanhamento de filho',
  SUSPENSAO: 'Suspensão disciplinar',
  FALTA_JUSTIFICADA_OUTROS: 'Falta justificada (outros)',
  FALTA_INJUSTIFICADA: 'Falta injustificada',
};

export const ABSENCE_STATUSES = ['PENDING', 'APPROVED', 'REJECTED'] as const;
export type AbsenceStatus = (typeof ABSENCE_STATUSES)[number];

export const ABSENCE_STATUS_LABELS: Record<AbsenceStatus, string> = {
  PENDING: 'Pendente',
  APPROVED: 'Aprovada',
  REJECTED: 'Rejeitada',
};

export const ABSENCE_STATUS_COLORS: Record<AbsenceStatus, string> = {
  PENDING: 'gold',
  APPROVED: 'green',
  REJECTED: 'red',
};

export interface EmployeeAbsence {
  id: string;
  condominiumId: string;
  employeeId: string;
  employeeName?: string;
  reason: AbsenceReason;
  reasonLabel: string;
  startDate: string;
  endDate: string;
  notes: string | null;
  status: AbsenceStatus;
  attachmentStorageKey: string | null;
  hasAttachment: boolean;
  reviewedByUserId: string | null;
  reviewedAt: string | null;
  reviewNotes: string | null;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AbsencePayload {
  employeeId: string;
  reason: AbsenceReason;
  startDate: string;
  endDate: string;
  notes?: string | null;
}

export interface ReviewAbsencePayload {
  status: 'APPROVED' | 'REJECTED';
  reviewNotes?: string | null;
}

export interface AbsenceFilters {
  from?: string;
  to?: string;
  employeeId?: string;
  reason?: AbsenceReason;
  status?: AbsenceStatus;
}
