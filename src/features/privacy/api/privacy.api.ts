import { httpClient } from '@/shared/api/http-client';
import type { DataInventory } from '../model/data-inventory.types';

export const privacyApi = {
  async getPlatformDataInventory(): Promise<DataInventory> {
    const { data } = await httpClient.get<DataInventory>('/privacy/data-inventory');

    return data;
  },
};
