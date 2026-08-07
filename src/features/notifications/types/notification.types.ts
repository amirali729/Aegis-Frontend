export type NotificationCategory =
  | "security"
  | "invitation"
  | "webhook"
  | "system";

export type NotificationSeverity = "info" | "warning" | "critical";

/**
 * Unified shape every notification source is normalized into. Sources
 * are aggregated client-side in `use-notification-feed.ts` — see that
 * file for which categories are backed by real endpoints today vs.
 * which are placeholders pending backend/feature work.
 */
export interface Notification {
  id: string;
  category: NotificationCategory;
  severity: NotificationSeverity;
  title: string;
  message: string;
  createdAt: string;
  /** In-app route to navigate to when the notification is clicked, if any. */
  href?: string;
  /** Whether this item is derived from a real API response or is a placeholder. */
  isLive: boolean;
}