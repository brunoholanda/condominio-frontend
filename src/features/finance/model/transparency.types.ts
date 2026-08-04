export interface TransparencyPayable {
  id: string;
  description: string;
  vendor: string;
  category: string;
  amountCents: number;
  dueDate: string;
  paidAt: string | null;
  notes: string | null;
  attachmentCount: number;
}

export interface TransparencyAttachment {
  id: string;
  type: 'INVOICE' | 'SERVICE_NOTE' | 'CONTRACT' | 'OTHER';
  fileName: string;
  mimeType: string;
  sizeBytes: number;
}

export interface TransparencyPayableDetail extends TransparencyPayable {
  attachments: TransparencyAttachment[];
}

export interface PaginatedTransparencyPayables {
  items: TransparencyPayable[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
