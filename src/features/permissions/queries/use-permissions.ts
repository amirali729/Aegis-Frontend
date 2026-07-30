import { useQuery } from "@tanstack/react-query";

import { permissionsApi } from "@/features/permissions/api/permissions.api";
import { queryKeys } from "@/shared/query/query-keys";

export function usePermissions() {
  return useQuery({
    queryKey: queryKeys.permissions.list,
    queryFn: () => permissionsApi.list(),
  });
}