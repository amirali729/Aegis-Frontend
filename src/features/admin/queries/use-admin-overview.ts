import { useQuery } from "@tanstack/react-query";

import { adminApi } from "@/features/admin/api/admin.api";
import { organizationsApi } from "@/features/organizations/api/organizations.api";
import { auditLogsApi } from "@/features/audit-logs/api/audit-logs.api";
import { queryKeys } from "@/shared/query/query-keys";

export function useAdminAuthMetrics() {
  return useQuery({ queryKey: queryKeys.admin.authMetrics, queryFn: () => adminApi.getAuthMetrics() });
}

export function useAdminOAuthMetrics() {
  return useQuery({ queryKey: queryKeys.admin.oauthMetrics, queryFn: () => adminApi.getOAuthMetrics() });
}

export function useAdminApplicationMetrics() {
  return useQuery({
    queryKey: queryKeys.admin.applicationMetrics,
    queryFn: () => adminApi.getApplicationMetrics(),
  });
}

export function useAdminApiKeyMetrics() {
  return useQuery({
    queryKey: queryKeys.admin.apiKeyMetrics,
    queryFn: () => adminApi.getApiKeyMetrics(),
  });
}

export function useAdminWebhookMetrics() {
  return useQuery({
    queryKey: queryKeys.admin.webhookMetrics,
    queryFn: () => adminApi.getWebhookMetrics(),
  });
}

export function useAdminOrganizationMetrics() {
  return useQuery({
    queryKey: queryKeys.admin.organizationMetrics,
    queryFn: () => adminApi.getOrganizationMetrics(),
  });
}

export function useAdminSystemHealth() {
  return useQuery({
    queryKey: queryKeys.admin.systemHealth,
    queryFn: () => adminApi.getSystemHealth(),
  });
}

/** Reuses the existing (already real) organizations list — platform-wide, no X-Tenant-ID scoping applied here. */
export function useAdminOrganizations() {
  return useQuery({
    queryKey: queryKeys.admin.organizations,
    queryFn: () => organizationsApi.list(),
  });
}

/** Reuses the existing audit-logs endpoint for a cross-org recent-activity feed. */
export function useAdminRecentActivity(limit = 8) {
  const filters = { page: 1, limit };
  return useQuery({
    queryKey: queryKeys.admin.recentActivity(filters),
    queryFn: () => auditLogsApi.list(filters),
  });
}
