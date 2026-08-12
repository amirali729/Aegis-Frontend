import type { AuditLogEntry } from "@/features/audit-logs/types/audit-log.types";

export interface CurrentOrganizationSummary {
  id: string;
  name: string;
  slug: string;
  plan: "free" | "pro" | "enterprise";
  roles: string[];
}

export interface Overview {
  user: {
    id: string;
    username: string;
    email: string;
    fullName?: string;
    isVerified: boolean;
    createdAt: string;
  };
  organizationsCount: number;
  /** Only populated when a tenant is resolved (an org is active). */
  currentOrganization?: CurrentOrganizationSummary;
  membersCount?: number;
  applicationsCount?: number;
  rolesCount?: number;
}

export interface DailyActivityCount {
  date: string;
  count: number;
}

export interface ActionCount {
  action: string;
  count: number;
}

export interface Activity {
  dailyCounts: DailyActivityCount[];
  totalLast7Days: number;
  totalLast30Days: number;
  topActions: ActionCount[];
  /** True when scoped to the caller only (no active organization). */
  scopedToSelf: boolean;
}

export interface Security {
  activeSessionsCount: number;
  failedLoginAttempts: number;
  accountLocked: boolean;
  lockUntil?: string;
  lastLoginAt?: string;
  isEmailVerified: boolean;
}

export interface Resources {
  organizations: number;
  applications: number;
  apiKeys: { active: number; revoked: number; total: number };
  roles: number;
  webhooks: number;
  scopedToOrganizationId?: string;
}

export interface RecentActivity {
  items: AuditLogEntry[];
  total: number;
  scopedToSelf: boolean;
}

export interface SystemHealth {
  status: "ok" | "degraded";
  uptimeSeconds: number;
  database: "connected" | "disconnected";
  environment: string;
  nodeVersion: string;
  memory: { rssMB: number; heapUsedMB: number; heapTotalMB: number };
  timestamp: string;
}
