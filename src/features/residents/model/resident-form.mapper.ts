import dayjs from 'dayjs';

import {
  maskCpf,
  maskPhone,
  maskPlate,
  onlyAlphanumeric,
  onlyDigits,
  upperCase,
} from '@/shared/utils/masks';
import { isListedKinship, OTHER_KINSHIP } from './kinship';
import type { HouseholdMemberFormValues, ResidentFormValues } from './resident-form.types';
import type { HouseholdMember, Resident, ResidentPayload } from './resident.types';

const DATE_FORMAT = 'YYYY-MM-DD';

function trimmed(value: string | undefined): string {
  return (value ?? '').trim();
}

/** Espelha a caixa alta do formulário em fichas antigas reenviadas sem reescrever o nome. */
function upperName(value: string | undefined): string {
  return upperCase(trimmed(value));
}

function toHouseholdMember(member: HouseholdMemberFormValues): HouseholdMember {
  const kinship = trimmed(member.kinship);

  return {
    fullName: upperName(member.fullName),
    rg: trimmed(member.rg),
    kinship: kinship === OTHER_KINSHIP ? trimmed(member.kinshipOther) : kinship,
  };
}

/** Relationships saved before/outside the option list fall back to "Outro". */
function toHouseholdMemberFormValues(member: HouseholdMember): HouseholdMemberFormValues {
  if (isListedKinship(member.kinship)) {
    return member;
  }

  return { ...member, kinship: OTHER_KINSHIP, kinshipOther: member.kinship };
}

/** Bridges the masked/Dayjs shape used by the UI and the plain contract of the API. */
export const residentFormMapper = {
  toPayload(values: ResidentFormValues): ResidentPayload {
    const landline = onlyDigits(values.landlinePhone);

    return {
      unit: trimmed(values.unit),
      occupancyType: values.occupancyType,
      fullName: upperName(values.fullName),
      rg: trimmed(values.rg),
      cpf: onlyDigits(values.cpf),
      email: trimmed(values.email).toLowerCase(),
      landlinePhone: landline === '' ? null : landline,
      mobilePhone: onlyDigits(values.mobilePhone),
      movedInAt: values.movedInAt.format(DATE_FORMAT),
      emergencyContact: {
        name: upperName(values.emergencyContact.name),
        phone: onlyDigits(values.emergencyContact.phone),
      },
      landlord:
        values.occupancyType === 'TENANT' && values.landlord
          ? {
              name: upperName(values.landlord.name),
              phone: onlyDigits(values.landlord.phone),
            }
          : null,
      householdMembers: (values.householdMembers ?? []).map(toHouseholdMember),
      employees: (values.employees ?? []).map((employee) => ({
        fullName: upperName(employee.fullName),
        rg: trimmed(employee.rg),
        role: trimmed(employee.role),
        workSchedule: trimmed(employee.workSchedule),
      })),
      vehicles: (values.vehicles ?? []).map((vehicle) => ({
        brand: trimmed(vehicle.brand),
        model: trimmed(vehicle.model),
        color: trimmed(vehicle.color),
        plate: onlyAlphanumeric(vehicle.plate),
      })),
      pets: (values.pets ?? []).map((pet) => ({
        name: upperName(pet.name),
        species: pet.species ?? 'OTHER',
        breed: trimmed(pet.breed) === '' ? null : trimmed(pet.breed),
        color: trimmed(pet.color),
      })),
      dataUsageConsent: values.dataUsageConsent,
      signature: values.signature,
    };
  },

  toFormValues(resident: Resident): ResidentFormValues {
    return {
      unit: resident.unit,
      occupancyType: resident.occupancyType,
      fullName: resident.fullName,
      rg: resident.rg,
      cpf: maskCpf(resident.cpf),
      email: resident.email,
      landlinePhone: resident.landlinePhone ? maskPhone(resident.landlinePhone) : undefined,
      mobilePhone: maskPhone(resident.mobilePhone),
      movedInAt: dayjs(resident.movedInAt),
      emergencyContact: {
        name: resident.emergencyContact.name,
        phone: maskPhone(resident.emergencyContact.phone),
      },
      landlord: resident.landlord
        ? { name: resident.landlord.name, phone: maskPhone(resident.landlord.phone) }
        : undefined,
      householdMembers: resident.householdMembers.map(toHouseholdMemberFormValues),
      employees: resident.employees,
      vehicles: resident.vehicles.map((vehicle) => ({
        ...vehicle,
        plate: maskPlate(vehicle.plate),
      })),
      pets: resident.pets.map((pet) => ({ ...pet, breed: pet.breed ?? undefined })),
      dataUsageConsent: resident.dataUsageConsent,
      signature: resident.signature,
      signedAt: dayjs(resident.signedAt),
    };
  },
};

/** `occupancyType` is intentionally absent: the user must choose it explicitly. */
export const emptyResidentFormValues: Partial<ResidentFormValues> = {
  householdMembers: [],
  employees: [],
  vehicles: [],
  pets: [],
  dataUsageConsent: false,
};
