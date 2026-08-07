import { ROUTES } from "@/shared/config/routes";
import type { AuditLogEntry } from "@/features/audit-logs/types/audit-log.types";
import type { Invitation } from "@/features/organizations/types/organization.types";
import type {
  Notification,
  NotificationSeverity,
} from "@/features/notifications/types/notification.types";

/**
 * Substrings of `AuditLogEntry.action` worth surfacing as a security
 * notification. The action taxonomy is backend-defined and free-form,
 * so this is a best-effort heuristic rather than an exhaustive enum.
 */
const SECURITY_ACTION_PATTERNS = [
  "login",
  "logout",
  "password",
  "mfa",
  "session",
  "api_key",
  "apikey",
  "role",
  "permission",
  "member",
  "invitation",
  "oauth_client",
  "webhook",
] as const;

function isSecurityRelevant(action: string): boolean {
  const lower = action.toLowerCase();
  return SECURITY_ACTION_PATTERNS.some((pattern) => lower.includes(pattern));
}

function humanizeAction(action: string): string {
  return action
    .replace(/[._]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function severityForEntry(entry: AuditLogEntry): NotificationSeverity {
  if (!entry.success) {
    return entry.action.toLowerCase().includes("login") ? "critical" : "warning";
  }
  return "info";
}

/** Real data — backed by `GET /audit-logs`. */
export function auditLogsToNotifications(entries: AuditLogEntry[]): Notification[] {
  return entries
    .filter((entry) => isSecurityRelevant(entry.action))
    .map((entry): Notification => {
      const detailParts = [
        entry.ipAddress ? `from ${entry.ipAddress}` : null,
        !entry.success ? "(failed)" : null,
      ].filter(Boolean);

      return {
        id: `audit:${entry.id}`,
        category: "security",
        severity: severityForEntry(entry),
        title: humanizeAction(entry.action),
        message: detailParts.length > 0 ? detailParts.join(" ") : "Security event recorded.",
        createdAt: entry.createdAt,
        href: ROUTES.auditLogs,
        isLive: true,
      };
    });
}

/** Real data — backed by `GET /organizations/:id/invitations` for the active org. */
export function invitationsToNotifications(
  invitations: Invitation[],
  organizationName: string | null,
): Notification[] {
  return invitations
    .filter((invitation) => invitation.status === "pending")
    .map(
      (invitation): Notification => ({
        id: `invitation:${invitation.id}`,
        category: "invitation",
        severity: "info",
        title: "Pending invitation",
        message: organizationName
          ? `${invitation.email} hasn't accepted their invite to ${organizationName} yet.`
          : `${invitation.email} hasn't accepted their invite yet.`,
        createdAt: invitation.createdAt,
        href: ROUTES.organizationDetails(invitation.organizationId),
        isLive: true,
      }),
    );
}

/**
 * Placeholder — there's no webhook delivery API on the frontend yet
 * (Webhook Management UI is a separate, not-yet-built feature). Once
 * that lands, swap this for a real query against its delivery-failures
 * endpoint. Kept here, clearly marked `isLive: false`, so the category
 * has something to show and the panel's layout/behavior can be built
 * and reviewed now.
 */
export function placeholderWebhookNotifications(): Notification[] {
  return [];
}

/** Placeholder system/product notices — local only, not from any API. */
export function placeholderSystemNotifications(): Notification[] {
  return [];
}