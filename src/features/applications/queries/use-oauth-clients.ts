import { useQuery } from "@tanstack/react-query";

import { oauthClientsApi } from "@/features/applications/api/oauth-clients.api";
import { queryKeys } from "@/shared/query/query-keys";

export function useOAuthClients(applicationId: string) {
  return useQuery({
    queryKey: queryKeys.applications.oauthClients(applicationId),
    queryFn: () => oauthClientsApi.list(applicationId),
    enabled: Boolean(applicationId),
  });
}