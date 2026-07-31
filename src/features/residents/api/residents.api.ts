import { httpClient } from '@/shared/api/http-client';
import type {
  PaginatedResidents,
  Resident,
  ResidentFilters,
  ResidentPayload,
} from '../model/resident.types';

const RESOURCE = '/residents';

export const residentsApi = {
  async list(filters: ResidentFilters): Promise<PaginatedResidents> {
    const { data } = await httpClient.get<PaginatedResidents>(RESOURCE, { params: filters });

    return data;
  },

  async getById(id: string): Promise<Resident> {
    const { data } = await httpClient.get<Resident>(`${RESOURCE}/${id}`);

    return data;
  },

  async create(payload: ResidentPayload): Promise<Resident> {
    const { data } = await httpClient.post<Resident>(RESOURCE, payload);

    return data;
  },

  async update(id: string, payload: ResidentPayload): Promise<Resident> {
    const { data } = await httpClient.put<Resident>(`${RESOURCE}/${id}`, payload);

    return data;
  },

  async remove(id: string): Promise<void> {
    await httpClient.delete(`${RESOURCE}/${id}`);
  },
};
