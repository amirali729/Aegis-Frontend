/**
 * Matches api-guide.md sections 5.16 (Metrics) and 5.17 (Admin) exactly.
 */

// ---- Metrics (platform-wide, GET /metrics/*, permission metrics:view) ----

export interface AuthMetrics {
  totalUsers: number;
  verifiedUsers: number;
  activeAccounts: number;
  deactivatedAccounts: number;
  lockedAccounts: number;
  signupsLast7Days: number;
  signupsLast30Days: number;
  loginsSucceededLast24h: number;
  loginsFailedLast24h: number;
}

export interface OAuthMetrics {
  totalClients: number;
  activeClients: number;
  revokedClients: number;
  accessTokensIssuedLast24h: number;
  activeAccessTokens: number;
  activeRefreshTokens: number;
  authorizationCodesIssuedLast24h: number;
  tokensRevokedLast24h: number;
}

export interface ApplicationMetrics {
  total: number;
  active: number;
  inactive: number;
  createdLast7Days: number;
  createdLast30Days: number;
}

export interface ApiKeyMetrics {
  total: number;
  active: number;
  revoked: number;
  expiringNext7Days: number;
  usedLast24h: number;
  neverUsed: number;
}

export interface WebhookMetrics {
  totalWebhooks: number;
  activeWebhooks: number;
  disabledWebhooks: number;
  deliveriesByStatus: {
    pending: number;
    delivering: number;
    delivered: number;
    failed: number;
    dead_letter: number;
  };
  deliveriesLast24h: number;
  /** Null when there's no delivery data yet — must render as "no data", not "0%". */
  successRateLast24h: number | null;
}

export interface OrganizationMetrics {
  total: number;
  active: number;
  suspended: number;
  byPlan: Record<string, number>;
  createdLast7Days: number;
  createdLast30Days: number;
}

// ---- Admin users (GET/PATCH /admin/users) ----

export type PlatformRole = "owner" | "admin" | "support" | "user";
export type AdminUserStatus = "active" | "deactivated";

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  fullName: string | null;
  platformRole: PlatformRole;
  status: AdminUserStatus;
  isVerified: boolean;
  failedLoginAttempts: number;
  lockUntil: string | null;
  createdAt: string;
}

export interface AdminUserOrganizationMembership {
  id: string;
  name: string;
  slug: string;
  roles: string[];
}

export interface AdminUserDetail extends AdminUser {
  organizations: AdminUserOrganizationMembership[];
}

export interface AdminUserFilters {
  page: number;
  limit: number;
  search?: string;
  platformRole?: PlatformRole | "all";
  status?: AdminUserStatus | "all";
}

export interface AdminUserListResponse {
  users: AdminUser[];
  total: number;
  page: number;
  limit: number;
}

export interface UpdateAdminUserPayload {
  platformRole?: PlatformRole;
  status?: AdminUserStatus;
}

// ---- Admin applications / API keys (read-only lists) ----

export interface AdminApplication {
  id: string;
  tenantId: string;
  name: string;
  clientId: string;
  isActive: boolean;
  createdAt: string;
}

export interface AdminApplicationListResponse {
  applications: AdminApplication[];
  total: number;
  page: number;
  limit: number;
}

export type AdminApiKeyStatus = "active" | "revoked";

export interface AdminApiKey {
  id: string;
  applicationId: string;
  name: string;
  keyPrefix: string;
  status: AdminApiKeyStatus;
  expiresAt: string | null;
  lastUsedAt: string | null;
  createdAt: string;
}

export interface AdminApiKeyListResponse {
  apiKeys: AdminApiKey[];
  total: number;
  page: number;
  limit: number;
}

// ---- Admin sessions (GET/DELETE /admin/users/:userId/sessions) ----

export interface AdminUserSession {
  id: string;
  deviceName: string;
  userAgent: string;
  ipAddress: string;
  lastActiveAt: string;
  createdAt: string;
  isCurrent: boolean;
}

export interface AdminUserSessionsResponse {
  userId: string;
  sessions: AdminUserSession[];
}

// ---- System settings (GET/PATCH /admin/system-settings) ----

export interface SystemSettings {
  allowSignups: boolean;
  maintenanceMode: boolean;
  maintenanceMessage: string | null;
  defaultOrganizationPlan: string;
  supportEmail: string | null;
  updatedAt: string;
}

export type UpdateSystemSettingsPayload = Partial<
  Omit<SystemSettings, "updatedAt">
>;

// ---- Overall system health (GET /dashboard/system-health) ----

export interface SystemHealth {
  status: "ok" | "degraded" | "down";
  uptimeSeconds: number;
  database: "connected" | "disconnected";
  environment: string;
  nodeVersion: string;
  /** Sub-field names assumed (standard Node.js process.memoryUsage() shape) — verify against the real response. */
  memory: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
  };
  timestamp: string;
}
