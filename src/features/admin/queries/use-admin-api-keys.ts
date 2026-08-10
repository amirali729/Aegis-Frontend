import { useQuery, keepPreviousData } from "@tanstack/react-query";

import { adminApi } from "@/features/admin/api/admin.api";
import { queryKeys } from "@/shared/query/query-keys";
import type { AdminApiKeyStatus } from "@/features/admin/types/admin.types";

export interface AdminApiKeyFilters {
  page: number;
  limit: number;
  applicationId?: string;
  status?: AdminApiKeyStatus | "all";
}

export function useAdminApiKeys(filters: AdminApiKeyFilters) {
  return useQuery({
    queryKey: queryKeys.admin.apiKeys(filters),
    queryFn: () =>
      adminApi.getApiKeys({
        page: filters.page,
        limit: filters.limit,
        applicationId: filters.applicationId,
        status: filters.status && filters.status !== "all" ? filters.status : undefined,
      }),
    placeholderData: keepPreviousData,
  });
}