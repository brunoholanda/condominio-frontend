export const WORK_ORDER_CATEGORIES = [
  'MAINTENANCE',
  'CLEANING',
  'SECURITY',
  'NOISE',
  'OTHER',
] as const;

export type WorkOrderCategory = (typeof WORK_ORDER_CATEGORIES)[number];

export const WORK_ORDER_CATEGORY_LABELS: Record<WorkOrderCategory, string> = {
  MAINTENANCE: 'Manutenção',
  CLEANING: 'Limpeza',
  SECURITY: 'Segurança',
  NOISE: 'Barulho',
  OTHER: 'Outros',
};

export const WORK_ORDER_PRIORITIES = ['LOW', 'NORMAL', 'HIGH', 'URGENT'] as const;
export type WorkOrderPriority = (typeof WORK_ORDER_PRIORITIES)[number];

export const WORK_ORDER_PRIORITY_LABELS: Record<WorkOrderPriority, string> = {
  LOW: 'Baixa',
  NORMAL: 'Normal',
  HIGH: 'Alta',
  URGENT: 'Urgente',
};

export const WORK_ORDER_PRIORITY_COLORS: Record<WorkOrderPriority, string> = {
  LOW: 'default',
  NORMAL: 'blue',
  HIGH: 'orange',
  URGENT: 'red',
};

export const WORK_ORDER_STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CANCELLED'] as const;
export type WorkOrderStatus = (typeof WORK_ORDER_STATUSES)[number];

export const WORK_ORDER_STATUS_LABELS: Record<WorkOrderStatus, string> = {
  OPEN: 'Aberto',
  IN_PROGRESS: 'Em andamento',
  RESOLVED: 'Resolvido',
  CANCELLED: 'Cancelado',
};

export const WORK_ORDER_STATUS_COLORS: Record<WorkOrderStatus, string> = {
  OPEN: 'gold',
  IN_PROGRESS: 'processing',
  RESOLVED: 'green',
  CANCELLED: 'default',
};

export interface WorkOrder {
  id: string;
  condominiumId: string;
  title: string;
  description: string;
  category: WorkOrderCategory;
  priority: WorkOrderPriority;
  status: WorkOrderStatus;
  unitNumber: string | null;
  reporterName: string | null;
  createdByUserId: string | null;
  assignedTo: string | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkOrderPayload {
  title: string;
  description: string;
  category: WorkOrderCategory;
  priority?: WorkOrderPriority;
  unitNumber?: string | null;
  reporterName?: string | null;
  assignedTo?: string | null;
}

export interface UpdateWorkOrderStatusPayload {
  status: WorkOrderStatus;
  assignedTo?: string | null;
}

export interface WorkOrderFilters {
  status?: WorkOrderStatus;
  category?: WorkOrderCategory;
}
