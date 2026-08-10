import { useQuery, keepPreviousData } from "@tanstack/react-query";

import { adminApi } from "@/features/admin/api/admin.api";
import { queryKeys } from "@/shared/query/query-keys";

export interface AdminApplicationFilters {
  page: number;
  limit: number;
  tenantId?: string;
}

export function useAdminApplications(filters: AdminApplicationFilters) {
  return useQuery({
    queryKey: queryKeys.admin.applications(filters),
    queryFn: () => adminApi.getApplications(filters),
    placeholderData: keepPreviousData,
  });
}