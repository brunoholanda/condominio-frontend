import { useQuery } from '@tanstack/react-query';

import { privacyApi } from '../api/privacy.api';

export function usePlatformDataInventoryQuery(enabled = true) {
  return useQuery({
    queryKey: ['privacy', 'data-inventory'],
    queryFn: () => privacyApi.getPlatformDataInventory(),
    enabled,
  });
}
