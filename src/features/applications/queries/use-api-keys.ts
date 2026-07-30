import { useQuery } from "@tanstack/react-query";

import { apiKeysApi } from "@/features/applications/api/api-keys.api";
import { queryKeys } from "@/shared/query/query-keys";

export function useApiKeys(applicationId: string) {
  return useQuery({
    queryKey: queryKeys.applications.apiKeys(applicationId),
    queryFn: () => apiKeysApi.list(applicationId),
    enabled: Boolean(applicationId),
  });
}