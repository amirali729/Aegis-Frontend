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
  Webhook,
  WebhookDelivery,
  WebhookSecretReveal,
} from "@/features/webhooks/types/webhook.types";
import type {
  CreateWebhookFormValues,
  UpdateWebhookFormValues,
} from "@/features/webhooks/schemas/webhook.schemas";

export interface DeliveryListParams {
  page?: number;
  limit?: number;
  status?: "success" | "failed" | "pending";
}

export interface DeliveryListResponse {
  deliveries: WebhookDelivery[];
  total: number;
  page: number;
  limit: number;
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
    return apiPost<WebhookSecretReveal>(
      buildWebhookPath(WEBHOOK_ROTATE_SECRET, { orgId, webhookId }),
    );
  },

  deliveries(orgId: string, webhookId: string, params: DeliveryListParams) {
    return apiGet<DeliveryListResponse>(
      buildWebhookPath(WEBHOOK_DELIVERY_LIST, { orgId, webhookId }),
      { params },
    );
  },

  redeliver(orgId: string, webhookId: string, deliveryId: string) {
    return apiPost<WebhookDelivery>(
      buildWebhookPath(WEBHOOK_DELIVERY_REDELIVER, { orgId, webhookId, deliveryId }),
    );
  },
};