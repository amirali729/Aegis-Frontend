import { useQueries, useQuery } from "@tanstack/react-query";

import { webhooksApi } from "@/features/webhooks/api/webhooks.api";
import { queryKeys } from "@/shared/query/query-keys";
import type { Webhook, WebhookDelivery } from "@/features/webhooks/types/webhook.types";

export type DeliveryWithWebhookName = WebhookDelivery & { webhookName: string };

export function useWebhooks(orgId: string) {
  return useQuery({
    queryKey: queryKeys.webhooks.list(orgId),
    queryFn: () => webhooksApi.list(orgId),
    enabled: Boolean(orgId),
  });
}

/**
 * The deliveries endpoint returns a bare array with no server-side
 * pagination or filtering (api-guide.md 5.12) — any paging/status
 * filtering happens client-side over the full result, see
 * deliveries-tab.tsx.
 */
export function useWebhookDeliveries(orgId: string, webhookId: string) {
  return useQuery({
    queryKey: queryKeys.webhooks.deliveries(orgId, webhookId),
    queryFn: () => webhooksApi.deliveries(orgId, webhookId),
    enabled: Boolean(orgId) && Boolean(webhookId),
  });
}

/**
 * There's no single "all deliveries across every webhook" endpoint —
 * deliveries are fetched one webhook at a time. This fans out a request
 * per webhook and merges the results client-side, for the dashboard's
 * "Recent Deliveries" panel and the computed stat cards. Fine for the
 * handful of webhooks an org typically has; would need a real aggregate
 * endpoint to scale further.
 */
export function useRecentDeliveriesAcrossWebhooks(orgId: string, webhooks: Webhook[]) {
  const results = useQueries({
    queries: webhooks.map((webhook) => ({
      queryKey: queryKeys.webhooks.deliveries(orgId, webhook.id),
      queryFn: () => webhooksApi.deliveries(orgId, webhook.id),
      enabled: Boolean(orgId) && Boolean(webhook.id),
    })),
  });

  const webhookNameById = new Map(webhooks.map((webhook) => [webhook.id, webhook.name]));

  const deliveries: DeliveryWithWebhookName[] = results
    .flatMap((result) => result.data ?? [])
    .map((delivery) => ({
      ...delivery,
      webhookName: webhookNameById.get(delivery.webhookId) ?? "Unknown webhook",
    }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return {
    deliveries,
    isLoading: results.some((result) => result.isLoading),
    isError: results.length > 0 && results.every((result) => result.isError),
    refetch: () => results.forEach((result) => result.refetch()),
  };
}
