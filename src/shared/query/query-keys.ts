/**
 * Central registry of query keys. Every feature's queries/mutations
 * import from here rather than inlining string arrays, so invalidation
 * stays consistent across the app.
 */
export const queryKeys = {
  auth: {
    session: ["auth", "session"] as const,
  },
  sessions: {
    list: ["sessions", "list"] as const,
  },
  organizations: {
    list: ["organizations", "list"] as const,
    detail: (id: string) => ["organizations", "detail", id] as const,
    members: (orgId: string) => ["organizations", orgId, "members"] as const,
    invitations: (orgId: string) =>
      ["organizations", orgId, "invitations"] as const,
  },
  roles: {
    list: ["roles", "list"] as const,
    detail: (id: string) => ["roles", "detail", id] as const,
  },
  permissions: {
    list: ["permissions", "list"] as const,
    detail: (id: string) => ["permissions", "detail", id] as const,
  },
  applications: {
    list: ["applications", "list"] as const,
    detail: (id: string) => ["applications", "detail", id] as const,
    apiKeys: (appId: string) => ["applications", appId, "api-keys"] as const,
    oauthClients: (appId: string) =>
      ["applications", appId, "oauth-clients"] as const,
  },
  auditLogs: {
    list: (filters: object) => ["audit-logs", "list", filters] as const,
  },
  webhooks: {
    list: (orgId: string) => ["organizations", orgId, "webhooks", "list"] as const,
    deliveries: (orgId: string, webhookId: string) =>
      ["organizations", orgId, "webhooks", webhookId, "deliveries"] as const,
  },
  admin: {
    authMetrics: ["admin", "metrics", "auth"] as const,
    oauthMetrics: ["admin", "metrics", "oauth"] as const,
    applicationMetrics: ["admin", "metrics", "applications"] as const,
    apiKeyMetrics: ["admin", "metrics", "api-keys"] as const,
    webhookMetrics: ["admin", "metrics", "webhooks"] as const,
    organizationMetrics: ["admin", "metrics", "organizations"] as const,
    systemHealth: ["admin", "system-health"] as const,
    systemSettings: ["admin", "system-settings"] as const,
    organizations: ["admin", "organizations"] as const,
    recentActivity: (filters: object) => ["admin", "recent-activity", filters] as const,
    users: (filters: object) => ["admin", "users", filters] as const,
    userDetail: (id: string) => ["admin", "users", id] as const,
    userSessions: (userId: string) => ["admin", "users", userId, "sessions"] as const,
  },
} as const;