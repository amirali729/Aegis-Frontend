import { useQuery } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";

import { auditLogsApi } from "@/features/audit-logs/api/audit-logs.api";
import { queryKeys } from "@/shared/query/query-keys";
import type { AuditLogFilters } from "@/features/audit-logs/types/audit-log.types";

export function useAuditLogs(filters: AuditLogFilters) {
  return useQuery({
    queryKey: queryKeys.auditLogs.list(filters),
    queryFn: () => auditLogsApi.list(filters),
    placeholderData: keepPreviousData,
  });
}