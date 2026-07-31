export const OCCUPANCY_TYPES = ['OWNER', 'TENANT'] as const;
export type OccupancyType = (typeof OCCUPANCY_TYPES)[number];

export const PET_SPECIES = ['DOG', 'CAT', 'BIRD', 'FISH', 'RODENT', 'REPTILE', 'OTHER'] as const;
export type PetSpecies = (typeof PET_SPECIES)[number];

export const OCCUPANCY_TYPE_LABELS: Record<OccupancyType, string> = {
  OWNER: 'Proprietário',
  TENANT: 'Inquilino',
};

export const PET_SPECIES_LABELS: Record<PetSpecies, string> = {
  DOG: 'Cachorro',
  CAT: 'Gato',
  BIRD: 'Ave',
  FISH: 'Peixe',
  RODENT: 'Roedor',
  REPTILE: 'Réptil',
  OTHER: 'Outro',
};

export interface ContactPerson {
  name: string;
  phone: string;
}

export interface HouseholdMember {
  fullName: string;
  rg: string;
  kinship: string;
}

export interface UnitEmployee {
  fullName: string;
  rg: string;
  role: string;
  workSchedule: string;
}

export interface Vehicle {
  brand: string;
  model: string;
  color: string;
  plate: string;
}

export interface Pet {
  name: string;
  species: PetSpecies;
  breed: string | null;
  color: string;
}

/** Request body accepted by `POST /residents` and `PUT /residents/:id`. */
export interface ResidentPayload {
  unit: string;
  occupancyType: OccupancyType;
  fullName: string;
  rg: string;
  cpf: string;
  email: string;
  landlinePhone: string | null;
  mobilePhone: string;
  movedInAt: string;
  emergencyContact: ContactPerson;
  landlord: ContactPerson | null;
  householdMembers: HouseholdMember[];
  employees: UnitEmployee[];
  vehicles: Vehicle[];
  pets: Pet[];
  dataUsageConsent: boolean;
  /** Handwritten signature as a base64 data URL. */
  signature: string;
  signedAt: string;
}

export interface Resident extends ResidentPayload {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResidents {
  items: Resident[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ResidentFilters {
  page: number;
  limit: number;
  search?: string;
  unit?: string;
  occupancyType?: OccupancyType;
}
