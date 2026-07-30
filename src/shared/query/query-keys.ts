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
  },
  auditLogs: {
    list: (filters: object) => ["audit-logs", "list", filters] as const,
  },
} as const;