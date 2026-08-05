import { httpClient } from '@/shared/api/http-client';

import type {
  AbsenceFilters,
  AbsencePayload,
  Employee,
  EmployeeAbsence,
  EmployeeListItem,
  EmployeePayload,
  PunchFilters,
  ReviewAbsencePayload,
  StaffLoginResponse,
  StaffMe,
  TimePunch,
} from '../model/staff.types';

function employeesPath(condominiumId: string) {
  return `/condominiums/${condominiumId}/employees`;
}

function punchesPath(condominiumId: string) {
  return `/condominiums/${condominiumId}/punches`;
}

function absencesPath(condominiumId: string) {
  return `/condominiums/${condominiumId}/absences`;
}

export const staffApi = {
  async list(condominiumId: string): Promise<EmployeeListItem[]> {
    const { data } = await httpClient.get<EmployeeListItem[]>(employeesPath(condominiumId));

    return data;
  },

  async get(condominiumId: string, employeeId: string): Promise<Employee> {
    const { data } = await httpClient.get<Employee>(
      `${employeesPath(condominiumId)}/${employeeId}`,
    );

    return data;
  },

  async create(
    condominiumId: string,
    payload: EmployeePayload & { pin?: string },
  ): Promise<Employee> {
    const { data } = await httpClient.post<Employee>(employeesPath(condominiumId), payload);

    return data;
  },

  async update(
    condominiumId: string,
    employeeId: string,
    payload: EmployeePayload,
  ): Promise<Employee> {
    const { data } = await httpClient.put<Employee>(
      `${employeesPath(condominiumId)}/${employeeId}`,
      payload,
    );

    return data;
  },

  async remove(condominiumId: string, employeeId: string): Promise<void> {
    await httpClient.delete(`${employeesPath(condominiumId)}/${employeeId}`);
  },

  async listPunches(condominiumId: string, filters: PunchFilters = {}): Promise<TimePunch[]> {
    const { data } = await httpClient.get<TimePunch[]>(punchesPath(condominiumId), {
      params: filters,
    });

    return data;
  },

  selfieUrl(condominiumId: string, punchId: string): string {
    const base = httpClient.defaults.baseURL ?? '';

    return `${base}${punchesPath(condominiumId)}/${punchId}/selfie`;
  },

  async exportPunchesCsv(condominiumId: string, filters: PunchFilters = {}): Promise<Blob> {
    const { data } = await httpClient.get<Blob>(`${punchesPath(condominiumId)}/export.csv`, {
      params: filters,
      responseType: 'blob',
    });

    return data;
  },

  async purgePunchSelfies(condominiumId: string): Promise<{ purged: number }> {
    const { data } = await httpClient.post<{ purged: number }>(
      `${punchesPath(condominiumId)}/purge-selfies`,
    );

    return data;
  },

  async listAbsences(
    condominiumId: string,
    filters: AbsenceFilters = {},
  ): Promise<EmployeeAbsence[]> {
    const { data } = await httpClient.get<EmployeeAbsence[]>(absencesPath(condominiumId), {
      params: filters,
    });

    return data;
  },

  async createAbsence(condominiumId: string, payload: AbsencePayload): Promise<EmployeeAbsence> {
    const { data } = await httpClient.post<EmployeeAbsence>(absencesPath(condominiumId), payload);

    return data;
  },

  async updateAbsence(
    condominiumId: string,
    absenceId: string,
    payload: Partial<AbsencePayload>,
  ): Promise<EmployeeAbsence> {
    const { data } = await httpClient.put<EmployeeAbsence>(
      `${absencesPath(condominiumId)}/${absenceId}`,
      payload,
    );

    return data;
  },

  async reviewAbsence(
    condominiumId: string,
    absenceId: string,
    payload: ReviewAbsencePayload,
  ): Promise<EmployeeAbsence> {
    const { data } = await httpClient.post<EmployeeAbsence>(
      `${absencesPath(condominiumId)}/${absenceId}/review`,
      payload,
    );

    return data;
  },

  async uploadAbsenceAttachment(
    condominiumId: string,
    absenceId: string,
    file: File,
  ): Promise<EmployeeAbsence> {
    const form = new FormData();
    form.append('file', file);

    const { data } = await httpClient.post<EmployeeAbsence>(
      `${absencesPath(condominiumId)}/${absenceId}/attachment`,
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );

    return data;
  },

  async removeAbsence(condominiumId: string, absenceId: string): Promise<void> {
    await httpClient.delete(`${absencesPath(condominiumId)}/${absenceId}`);
  },

  async login(slug: string, cpf: string, pin: string): Promise<StaffLoginResponse> {
    const { data } = await httpClient.post<StaffLoginResponse>(`/c/${slug}/staff/login`, {
      cpf,
      pin,
    });

    return data;
  },

  async me(slug: string, accessToken: string): Promise<StaffMe> {
    const { data } = await httpClient.get<StaffMe>(`/c/${slug}/staff/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return data;
  },

  async punch(slug: string, accessToken: string, form: FormData): Promise<TimePunch> {
    const { data } = await httpClient.post<TimePunch>(`/c/${slug}/staff/punches`, form, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    return data;
  },

  async listStaffVisitors(
    slug: string,
    accessToken: string,
    params?: { status?: string },
  ): Promise<import('@/features/visitors/model/visitor.types').VisitorPass[]> {
    const { data } = await httpClient.get(`/c/${slug}/staff/visitors`, {
      params,
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return data;
  },

  async createStaffVisitor(
    slug: string,
    accessToken: string,
    payload: import('@/features/visitors/model/visitor.types').CreateVisitorPassPayload,
  ): Promise<import('@/features/visitors/model/visitor.types').VisitorPass> {
    const { data } = await httpClient.post(`/c/${slug}/staff/visitors`, payload, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return data;
  },

  async checkInStaffVisitor(
    slug: string,
    accessToken: string,
    passId: string,
  ): Promise<import('@/features/visitors/model/visitor.types').VisitorPass> {
    const { data } = await httpClient.post(
      `/c/${slug}/staff/visitors/${passId}/check-in`,
      {},
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    return data;
  },

  async listStaffPackages(
    slug: string,
    accessToken: string,
    params?: { status?: string; page?: number; limit?: number },
  ): Promise<import('@/features/deliveries/model/delivery.types').PaginatedPackages> {
    const { data } = await httpClient.get(`/c/${slug}/staff/packages`, {
      params,
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return data;
  },

  async createStaffPackage(
    slug: string,
    accessToken: string,
    payload: import('@/features/deliveries/model/delivery.types').CreatePackagePayload,
  ): Promise<import('@/features/deliveries/model/delivery.types').CondoPackage> {
    const { data } = await httpClient.post(`/c/${slug}/staff/packages`, payload, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return data;
  },

  async deliverStaffPackage(
    slug: string,
    accessToken: string,
    packageId: string,
    payload: { recipientName: string; signature: string },
  ): Promise<import('@/features/deliveries/model/delivery.types').CondoPackage> {
    const { data } = await httpClient.post(
      `/c/${slug}/staff/packages/${packageId}/deliver`,
      payload,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    return data;
  },

  async createStaffSigningSession(
    slug: string,
    accessToken: string,
    packageId: string,
  ): Promise<import('@/features/deliveries/model/delivery.types').SigningSession> {
    const { data } = await httpClient.post(
      `/c/${slug}/staff/packages/${packageId}/signing-session`,
      {},
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    return data;
  },
};
