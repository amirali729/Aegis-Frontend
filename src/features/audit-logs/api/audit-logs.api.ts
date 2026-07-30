import { apiGet } from "@/shared/api/request";
import type {
  AuditLogEntry,
  AuditLogFilters,
} from "@/features/audit-logs/types/audit-log.types";

interface AuditLogsResponse {
  logs: AuditLogEntry[];
  total: number;
  page: number;
  limit: number;
}

export const auditLogsApi = {
  list(filters: AuditLogFilters) {
    return apiGet<AuditLogsResponse>("/audit-logs", { params: filters });
  },
};