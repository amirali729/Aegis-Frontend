import { useMutation, useQueryClient } from "@tanstack/react-query";

import { webhooksApi } from "@/features/webhooks/api/webhooks.api";
import { queryKeys } from "@/shared/query/query-keys";
import { toast } from "@/shared/lib/toast";
import { getErrorMessage } from "@/shared/errors/get-error-message";
import type {
  CreateWebhookFormValues,
  UpdateWebhookFormValues,
} from "@/features/webhooks/schemas/webhook.schemas";

export function useCreateWebhook(orgId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateWebhookFormValues) => webhooksApi.create(orgId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.webhooks.list(orgId) });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useUpdateWebhook(orgId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ webhookId, body }: { webhookId: string; body: UpdateWebhookFormValues }) =>
      webhooksApi.update(orgId, webhookId, body),
    onSuccess: () => {
      toast.success("Webhook updated.");
      queryClient.invalidateQueries({ queryKey: queryKeys.webhooks.list(orgId) });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useDeleteWebhook(orgId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (webhookId: string) => webhooksApi.remove(orgId, webhookId),
    onSuccess: () => {
      toast.success("Webhook deleted.");
      queryClient.invalidateQueries({ queryKey: queryKeys.webhooks.list(orgId) });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useToggleWebhookEnabled(orgId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ webhookId, enable }: { webhookId: string; enable: boolean }) =>
      enable ? webhooksApi.enable(orgId, webhookId) : webhooksApi.disable(orgId, webhookId),
    onSuccess: (_data, variables) => {
      toast.success(variables.enable ? "Webhook enabled." : "Webhook disabled.");
      queryClient.invalidateQueries({ queryKey: queryKeys.webhooks.list(orgId) });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useRotateWebhookSecret(orgId: string) {
  return useMutation({
    mutationFn: (webhookId: string) => webhooksApi.rotateSecret(orgId, webhookId),
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useRedeliverWebhookDelivery(orgId: string, webhookId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (deliveryId: string) => webhooksApi.redeliver(orgId, webhookId, deliveryId),
    onSuccess: (data) => {
      toast.success(data.message || "Redelivery queued.");
      queryClient.invalidateQueries({ queryKey: queryKeys.webhooks.deliveries(orgId, webhookId) });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}
