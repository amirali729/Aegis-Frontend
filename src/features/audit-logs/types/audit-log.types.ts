export interface AuditLogEntry {
  id: string;
  actorId: string | null;
  actorType: "user" | "system" | "api_key";
  action: string;
  success: boolean;
  targetType: string | null;
  targetId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface AuditLogFilters {
  page: number;
  limit: number;
  actorId?: string;
  action?: string;
  targetType?: string;
  targetId?: string;
  from?: string;
  to?: string;
}