import type {
  ComputedWebhookStats,
  Webhook,
  WebhookDelivery,
} from "@/features/webhooks/types/webhook.types";

export function computeWebhookStats(
  webhooks: Webhook[],
  sampledDeliveries: WebhookDelivery[],
): ComputedWebhookStats {
  const deliveredCount = sampledDeliveries.filter((d) => d.status === "delivered").length;
  const failedCount = sampledDeliveries.filter(
    (d) => d.status === "failed" || d.status === "dead_letter",
  ).length;
  const resolvedCount = deliveredCount + failedCount;

  const eventCounts = new Map<string, number>();
  for (const delivery of sampledDeliveries) {
    eventCounts.set(delivery.eventType, (eventCounts.get(delivery.eventType) ?? 0) + 1);
  }
  const total = sampledDeliveries.length;
  const topEvents = Array.from(eventCounts.entries())
    .map(([event, count]) => ({
      event,
      count,
      percentage: total > 0 ? Math.round((count / total) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalWebhooks: webhooks.length,
    activeWebhooks: webhooks.filter((webhook) => webhook.status === "active").length,
    sampledDeliveryCount: total,
    deliveredCount,
    failedCount,
    successRate: resolvedCount > 0 ? (deliveredCount / resolvedCount) * 100 : null,
    topEvents,
  };
}
