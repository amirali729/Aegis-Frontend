import { apiDelete, apiGet, apiPatch, apiPost } from "@/shared/api/request";
import {
  buildWebhookPath,
  WEBHOOK_CREATE,
  WEBHOOK_DELETE,
  WEBHOOK_DELIVERY_LIST,
  WEBHOOK_DELIVERY_REDELIVER,
  WEBHOOK_DISABLE,
  WEBHOOK_ENABLE,
  WEBHOOK_LIST,
  WEBHOOK_ROTATE_SECRET,
  WEBHOOK_UPDATE,
} from "@/features/webhooks/constants/webhook-endpoints";
import type {
  CreateWebhookResponse,
  RedeliverResponse,
  Webhook,
  WebhookDelivery,
} from "@/features/webhooks/types/webhook.types";
import type {
  CreateWebhookFormValues,
  UpdateWebhookFormValues,
} from "@/features/webhooks/schemas/webhook.schemas";

/** api-guide.md 5.12: POST .../rotate-secret returns { webhookId, secret, warning }. */
export interface RotateSecretResponse {
  webhookId: string;
  secret: string;
  warning: string;
}

export const webhooksApi = {
  list(orgId: string) {
    return apiGet<Webhook[]>(buildWebhookPath(WEBHOOK_LIST, { orgId }));
  },

  create(orgId: string, body: CreateWebhookFormValues) {
    return apiPost<CreateWebhookResponse>(buildWebhookPath(WEBHOOK_CREATE, { orgId }), body);
  },

  update(orgId: string, webhookId: string, body: UpdateWebhookFormValues) {
    return apiPatch<Webhook>(buildWebhookPath(WEBHOOK_UPDATE, { orgId, webhookId }), body);
  },

  remove(orgId: string, webhookId: string) {
    return apiDelete<{ message: string }>(
      buildWebhookPath(WEBHOOK_DELETE, { orgId, webhookId }),
    );
  },

  enable(orgId: string, webhookId: string) {
    return apiPost<Webhook>(buildWebhookPath(WEBHOOK_ENABLE, { orgId, webhookId }));
  },

  disable(orgId: string, webhookId: string) {
    return apiPost<Webhook>(buildWebhookPath(WEBHOOK_DISABLE, { orgId, webhookId }));
  },

  rotateSecret(orgId: string, webhookId: string) {
    return apiPost<RotateSecretResponse>(
      buildWebhookPath(WEBHOOK_ROTATE_SECRET, { orgId, webhookId }),
    );
  },

  /** Bare array, no pagination — api-guide.md 5.12. */
  deliveries(orgId: string, webhookId: string) {
    return apiGet<WebhookDelivery[]>(
      buildWebhookPath(WEBHOOK_DELIVERY_LIST, { orgId, webhookId }),
    );
  },

  redeliver(orgId: string, webhookId: string, deliveryId: string) {
    return apiPost<RedeliverResponse>(
      buildWebhookPath(WEBHOOK_DELIVERY_REDELIVER, { orgId, webhookId, deliveryId }),
    );
  },
};
