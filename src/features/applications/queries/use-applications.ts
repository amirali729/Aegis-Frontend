import { useQuery } from "@tanstack/react-query";

import { applicationsApi } from "@/features/applications/api/applications.api";
import { queryKeys } from "@/shared/query/query-keys";

export function useApplications(enabled = true) {
  return useQuery({
    queryKey: queryKeys.applications.list,
    queryFn: () => applicationsApi.list(),
    enabled,
  });
}

export function useApplication(id: string) {
  return useQuery({
    queryKey: queryKeys.applications.detail(id),
    queryFn: () => applicationsApi.get(id),
    enabled: Boolean(id),
  });
}