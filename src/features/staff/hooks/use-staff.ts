import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { staffApi } from '../api/staff.api';
import type {
  AbsenceFilters,
  AbsencePayload,
  EmployeePayload,
  PunchFilters,
  ReviewAbsencePayload,
} from '../model/staff.types';

export const staffKeys = {
  all: ['staff'] as const,
  list: (condoId: string) => [...staffKeys.all, 'list', condoId] as const,
  detail: (condoId: string, id: string) => [...staffKeys.all, 'detail', condoId, id] as const,
  punches: (condoId: string, filters: PunchFilters) =>
    [...staffKeys.all, 'punches', condoId, filters] as const,
  absences: (condoId: string, filters: AbsenceFilters) =>
    [...staffKeys.all, 'absences', condoId, filters] as const,
};

export function useEmployeesQuery(condominiumId: string) {
  return useQuery({
    queryKey: staffKeys.list(condominiumId),
    queryFn: () => staffApi.list(condominiumId),
  });
}

export function useEmployeeQuery(condominiumId: string, employeeId: string | undefined) {
  return useQuery({
    queryKey: staffKeys.detail(condominiumId, employeeId ?? ''),
    queryFn: () => staffApi.get(condominiumId, employeeId as string),
    enabled: Boolean(employeeId) && employeeId !== 'novo',
  });
}

export function useCreateEmployeeMutation(condominiumId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: EmployeePayload & { pin: string }) =>
      staffApi.create(condominiumId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: staffKeys.list(condominiumId) }),
  });
}

export function useUpdateEmployeeMutation(condominiumId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ employeeId, payload }: { employeeId: string; payload: EmployeePayload }) =>
      staffApi.update(condominiumId, employeeId, payload),
    onSuccess: (employee) => {
      queryClient.invalidateQueries({ queryKey: staffKeys.list(condominiumId) });
      queryClient.invalidateQueries({
        queryKey: staffKeys.detail(condominiumId, employee.id),
      });
    },
  });
}

export function useDeleteEmployeeMutation(condominiumId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (employeeId: string) => staffApi.remove(condominiumId, employeeId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: staffKeys.list(condominiumId) }),
  });
}

export function usePunchesQuery(condominiumId: string, filters: PunchFilters) {
  return useQuery({
    queryKey: staffKeys.punches(condominiumId, filters),
    queryFn: () => staffApi.listPunches(condominiumId, filters),
  });
}

export function useAbsencesQuery(condominiumId: string, filters: AbsenceFilters) {
  return useQuery({
    queryKey: staffKeys.absences(condominiumId, filters),
    queryFn: () => staffApi.listAbsences(condominiumId, filters),
  });
}

export function useCreateAbsenceMutation(condominiumId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AbsencePayload) => staffApi.createAbsence(condominiumId, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [...staffKeys.all, 'absences', condominiumId] }),
  });
}

export function useUpdateAbsenceMutation(condominiumId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      absenceId,
      payload,
    }: {
      absenceId: string;
      payload: Partial<AbsencePayload>;
    }) => staffApi.updateAbsence(condominiumId, absenceId, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [...staffKeys.all, 'absences', condominiumId] }),
  });
}

export function useDeleteAbsenceMutation(condominiumId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (absenceId: string) => staffApi.removeAbsence(condominiumId, absenceId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [...staffKeys.all, 'absences', condominiumId] }),
  });
}

export function useReviewAbsenceMutation(condominiumId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      absenceId,
      payload,
    }: {
      absenceId: string;
      payload: ReviewAbsencePayload;
    }) => staffApi.reviewAbsence(condominiumId, absenceId, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [...staffKeys.all, 'absences', condominiumId] }),
  });
}

export function useUploadAbsenceAttachmentMutation(condominiumId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ absenceId, file }: { absenceId: string; file: File }) =>
      staffApi.uploadAbsenceAttachment(condominiumId, absenceId, file),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [...staffKeys.all, 'absences', condominiumId] }),
  });
}

export function useExportPunchesCsvMutation(condominiumId: string) {
  return useMutation({
    mutationFn: (filters: PunchFilters) => staffApi.exportPunchesCsv(condominiumId, filters),
  });
}

export function usePurgePunchSelfiesMutation(condominiumId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => staffApi.purgePunchSelfies(condominiumId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [...staffKeys.all, 'punches', condominiumId] }),
  });
}
