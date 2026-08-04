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
}

export interface Resident extends ResidentPayload {
  id: string;
  /** Date and time of the signature, stamped by the API. */
  signedAt: string;
  createdAt: string;
  updatedAt: string;
}

/** A listagem não recebe a assinatura: a tabela não a mostra e ninguém precisa dela ali. */
export type ResidentListItem = Omit<Resident, 'signature'>;

export interface PaginatedResidents {
  items: ResidentListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** How much of the condo already answered the form. */
export interface ResidentsSummary {
  totalUnits: number;
  registeredUnits: number;
  pendingUnits: number;
  /** Quais unidades ainda não preencheram, em ordem. */
  pendingUnitNumbers: string[];
  vacantUnits: number;
  /** Unidades sinalizadas como desocupadas no momento. */
  vacantUnitNumbers: string[];
  totalPeople: number;
}

/** Criteria shared by the listing and by the PDF report. */
export interface ResidentSearchFilters {
  search?: string;
  unit?: string;
  occupancyType?: OccupancyType;
}

export interface ResidentFilters extends ResidentSearchFilters {
  page: number;
  limit: number;
}
