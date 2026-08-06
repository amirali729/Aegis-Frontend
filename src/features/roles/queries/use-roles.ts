import { useQuery } from "@tanstack/react-query";

import { rolesApi } from "@/features/roles/api/roles.api";
import { queryKeys } from "@/shared/query/query-keys";

export function useRoles(enabled = true) {
  return useQuery({
    queryKey: queryKeys.roles.list,
    queryFn: () => rolesApi.list(),
    enabled,
  });
}