/**
 * Matches api-guide.md section 5.12 exactly.
 */
export type WebhookStatus = "active" | "disabled";

export interface Webhook {
  id: string;
  organizationId: string;
  name: string;
  url: string;
  status: WebhookStatus;
  subscribedEvents: string[];
  lastSuccessAt: string | null;
  lastFailureAt: string | null;
  createdAt: string;
}

export interface WebhookSecretReveal {
  secret: string;
  warning: string;
}

export type CreateWebhookResponse = Webhook & WebhookSecretReveal;

/** Matches the real 5-state delivery status enum from api-guide.md 5.12. */
export type DeliveryStatus = "pending" | "delivering" | "delivered" | "failed" | "dead_letter";

export interface WebhookDelivery {
  id: string;
  webhookId: string;
  eventId: string;
  eventType: string;
  status: DeliveryStatus;
  attempts: number;
  maxAttempts: number;
  nextAttemptAt: string | null;
  lastAttemptAt: string | null;
  responseStatus: number | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RedeliverResponse {
  deliveryId: string;
  status: "pending";
  message: string;
}

export interface WebhookEventBreakdown {
  event: string;
  count: number;
  percentage: number;
}

/**
 * There's no backend stats/analytics endpoint for webhooks (confirmed —
 * api-guide.md 5.12 has no such route; GET /metrics/webhooks in 5.16 is
 * platform-wide only, not per-organization, so it can't back this page
 * either). These numbers are computed client-side in
 * lib/compute-webhook-stats.ts from the webhook list plus each
 * webhook's deliveries. No "vs last 7 days" — there's no baseline to
 * compare against without a real aggregate endpoint.
 */
export interface ComputedWebhookStats {
  totalWebhooks: number;
  activeWebhooks: number;
  sampledDeliveryCount: number;
  deliveredCount: number;
  failedCount: number;
  successRate: number | null;
  topEvents: WebhookEventBreakdown[];
}
