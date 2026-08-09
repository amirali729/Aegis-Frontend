import { apiDelete, apiGet, apiPatch } from "@/shared/api/request";
import type {
  AdminApiKeyListResponse,
  AdminApplicationListResponse,
  AdminUserDetail,
  AdminUserFilters,
  AdminUserListResponse,
  AdminUserSessionsResponse,
  ApiKeyMetrics,
  ApplicationMetrics,
  AuthMetrics,
  OAuthMetrics,
  OrganizationMetrics,
  SystemHealth,
  SystemSettings,
  UpdateAdminUserPayload,
  UpdateSystemSettingsPayload,
  WebhookMetrics,
} from "@/features/admin/types/admin.types";

export const adminApi = {
  // ---- Users (api-guide.md 5.17, permission user:view / user:update) ----
  getUsers(filters: AdminUserFilters) {
    return apiGet<AdminUserListResponse>("/admin/users", { params: filters });
  },

  getUser(id: string) {
    return apiGet<AdminUserDetail>(`/admin/users/${id}`);
  },

  updateUser(id: string, body: UpdateAdminUserPayload) {
    return apiPatch<AdminUserDetail>(`/admin/users/${id}`, body);
  },

  // ---- Per-user sessions (permission session:view / session:revoke) ----
  getUserSessions(userId: string) {
    return apiGet<AdminUserSessionsResponse>(`/admin/users/${userId}/sessions`);
  },

  revokeUserSession(userId: string, sessionId: string) {
    return apiDelete<{ message: string }>(`/admin/users/${userId}/sessions/${sessionId}`);
  },

  // ---- Applications / API keys (read-only cross-tenant lists) ----
  getApplications(params: { page?: number; limit?: number; tenantId?: string }) {
    return apiGet<AdminApplicationListResponse>("/admin/applications", { params });
  },

  getApiKeys(params: {
    page?: number;
    limit?: number;
    applicationId?: string;
    status?: "active" | "revoked";
  }) {
    return apiGet<AdminApiKeyListResponse>("/admin/api-keys", { params });
  },

  // ---- System settings (permission system:settings:view / :update, update is Owner-only) ----
  getSystemSettings() {
    return apiGet<SystemSettings>("/admin/system-settings");
  },

  updateSystemSettings(body: UpdateSystemSettingsPayload) {
    return apiPatch<SystemSettings>("/admin/system-settings", body);
  },

  // ---- Platform-wide metrics (api-guide.md 5.16, permission metrics:view) ----
  getAuthMetrics() {
    return apiGet<AuthMetrics>("/metrics/auth");
  },

  getOAuthMetrics() {
    return apiGet<OAuthMetrics>("/metrics/oauth");
  },

  getApplicationMetrics() {
    return apiGet<ApplicationMetrics>("/metrics/applications");
  },

  getApiKeyMetrics() {
    return apiGet<ApiKeyMetrics>("/metrics/api-keys");
  },

  getWebhookMetrics() {
    return apiGet<WebhookMetrics>("/metrics/webhooks");
  },

  getOrganizationMetrics() {
    return apiGet<OrganizationMetrics>("/metrics/organizations");
  },

  // ---- Overall system health (api-guide.md 5.15, gated by audit:view) ----
  getSystemHealth() {
    return apiGet<SystemHealth>("/dashboard/system-health");
  },
};
