import type { DomainEventType } from "@/features/webhooks/constants/webhook-events";

/**
 * The response shape for a webhook itself wasn't provided (only the
 * routes and the event vocabulary were) — `isEnabled` is inferred from
 * ENABLE/DISABLE being separate boolean-toggle endpoints rather than a
 * generic PATCH { status }. Adjust field names here if the real
 * response differs; every consumer reads through this type, not raw
 * API responses.
 */
export interface Webhook {
  id: string;
  organizationId: string;
  name: string;
  endpointUrl: string;
  events: DomainEventType[];
  isEnabled: boolean;
  createdAt: string;
}

export interface WebhookSecretReveal {
  signingSecret: string;
  warning: string;
}

export type CreateWebhookResponse = Webhook & WebhookSecretReveal;

export type DeliveryStatus = "success" | "failed" | "pending";

export interface WebhookDelivery {
  id: string;
  webhookId: string;
  event: DomainEventType;
  /** A short, human description of the subject, e.g. "User ID: usr_...". */
  subjectLabel: string;
  status: DeliveryStatus;
  httpStatus: number | null;
  occurredAt: string;
  responseTimeMs: number | null;
  /** Number of delivery attempts made so far, if the backend tracks retries. */
  attemptCount?: number;
}

export interface WebhookEventBreakdown {
  event: DomainEventType;
  count: number;
  percentage: number;
}

/**
 * There's no backend stats/analytics endpoint for webhooks — these
 * numbers are computed client-side in `lib/compute-webhook-stats.ts`
 * from the webhook list plus a recent sample of deliveries fetched per
 * webhook. They're real counts of what was actually fetched, not
 * historical trends (no "vs last 7 days" — there's no baseline to
 * compare against without a real aggregate endpoint).
 */
export interface ComputedWebhookStats {
  totalWebhooks: number;
  activeWebhooks: number;
  sampledDeliveryCount: number;
  successCount: number;
  failedCount: number;
  successRate: number | null;
  topEvents: WebhookEventBreakdown[];
}