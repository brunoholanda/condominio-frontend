import type { Dayjs } from 'dayjs';

import type { ContactPerson, OccupancyType, PetSpecies } from './resident.types';

/** Row shapes used by the dynamic sections while the form is being filled. */
export interface HouseholdMemberFormValues {
  fullName?: string;
  rg?: string;
  kinship?: string;
  /** Filled only when `kinship` is the "Outro" option. */
  kinshipOther?: string;
}

export interface UnitEmployeeFormValues {
  fullName?: string;
  rg?: string;
  role?: string;
  workSchedule?: string;
}

export interface VehicleFormValues {
  brand?: string;
  model?: string;
  color?: string;
  plate?: string;
}

export interface PetFormValues {
  name?: string;
  species?: PetSpecies;
  breed?: string;
  color?: string;
}

/**
 * Values held by the Ant Design form. Text fields keep their masks and dates are
 * Dayjs instances; `residentFormMapper` converts them to the API contract.
 */
export interface ResidentFormValues {
  unit: string;
  occupancyType: OccupancyType;
  fullName: string;
  rg: string;
  cpf: string;
  email: string;
  landlinePhone?: string;
  mobilePhone: string;
  movedInAt: Dayjs;
  emergencyContact: ContactPerson;
  landlord?: ContactPerson;
  householdMembers?: HouseholdMemberFormValues[];
  employees?: UnitEmployeeFormValues[];
  vehicles?: VehicleFormValues[];
  pets?: PetFormValues[];
  dataUsageConsent: boolean;
  signature: string;
  /** Only present when editing: new registrations are dated by the API. */
  signedAt?: Dayjs;
}
