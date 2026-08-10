import { useMemo } from "react";

import { useAuditLogs } from "@/features/audit-logs/queries/use-audit-logs";
import { useInvitations } from "@/features/organizations/queries/use-organizations";
import { useCurrentOrganization } from "@/features/settings/hooks/use-current-organization";
import { useNotificationPreferencesStore } from "@/features/settings/store/notification-preferences";
import { useNotificationStore } from "@/features/notifications/store/notification-store";
import { useWebhooks, useRecentDeliveriesAcrossWebhooks } from "@/features/webhooks/queries/use-webhooks";
import {
  auditLogsToNotifications,
  invitationsToNotifications,
  placeholderSystemNotifications,
  webhookDeliveriesToNotifications,
} from "@/features/notifications/lib/build-notifications";
import type { Notification } from "@/features/notifications/types/notification.types";

const FEED_LIMIT = 25;

export interface NotificationFeedItem extends Notification {
  isRead: boolean;
}

/**
 * Aggregates every notification source into one sorted feed.
 *
 * There is no dedicated `/notifications` endpoint on the backend yet, so
 * this composes real, already-available queries: recent audit log
 * entries filtered to security-relevant actions, pending invitations for
 * the active organization, and failing webhook deliveries for the
 * active organization's webhooks (reusing the same aggregation hook the
 * Webhooks feature's own dashboard panel uses). Only "system" notices
 * remain a placeholder — there's genuinely no product-announcements
 * data source anywhere in the API. Read state is tracked separately in
 * `notification-store` since the underlying items are recomputed on
 * every load rather than persisted server-side.
 */
export function useNotificationFeed() {
  const { organization, isLoading: isOrgLoading } = useCurrentOrganization();
  const preferences = useNotificationPreferencesStore();
  const isRead = useNotificationStore((state) => state.isRead);
  const dismissedIds = useNotificationStore((state) => state.dismissedIds);

  const auditLogsQuery = useAuditLogs(
    { page: 1, limit: FEED_LIMIT },
    preferences.inAppAuditAlerts,
  );
  const invitationsQuery = useInvitations(organization?.id ?? "");
  const webhooksQuery = useWebhooks(organization?.id ?? "");
  const webhookDeliveries = useRecentDeliveriesAcrossWebhooks(
    organization?.id ?? "",
    webhooksQuery.data ?? [],
  );

  const items = useMemo<NotificationFeedItem[]>(() => {
    const security = preferences.inAppAuditAlerts
      ? auditLogsToNotifications(auditLogsQuery.data?.logs ?? [])
      : [];
    const invitations = invitationsToNotifications(
      invitationsQuery.data ?? [],
      organization?.name ?? null,
    );
    const webhooks = webhookDeliveriesToNotifications(webhookDeliveries.deliveries);
    const system = placeholderSystemNotifications();

    const merged = [...security, ...invitations, ...webhooks, ...system]
      .filter((item) => !dismissedIds.includes(item.id))
      .sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, FEED_LIMIT);

    return merged.map((item) => ({ ...item, isRead: isRead(item.id) }));
  }, [
    auditLogsQuery.data,
    invitationsQuery.data,
    webhookDeliveries.deliveries,
    organization?.name,
    preferences.inAppAuditAlerts,
    dismissedIds,
    isRead,
  ]);

  const unreadCount = items.filter((item) => !item.isRead).length;

  // Best-effort feed: a permission or network hiccup on one source
  // (e.g. no invitation:view permission for the active org) shouldn't
  // blank out notifications from the others. Only surface a blocking
  // error state if every live source failed.
  const isError = auditLogsQuery.isError && invitationsQuery.isError && webhooksQuery.isError;

  return {
    items,
    unreadCount,
    isLoading:
      isOrgLoading || auditLogsQuery.isLoading || invitationsQuery.isLoading || webhooksQuery.isLoading,
    isError,
    error: auditLogsQuery.error ?? invitationsQuery.error ?? webhooksQuery.error,
    refetch: () => {
      auditLogsQuery.refetch();
      invitationsQuery.refetch();
      webhooksQuery.refetch();
      webhookDeliveries.refetch();
    },
  };
}