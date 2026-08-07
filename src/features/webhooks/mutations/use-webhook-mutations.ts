import { useMutation, useQueryClient } from "@tanstack/react-query";

import { webhooksApi } from "@/features/webhooks/api/webhooks.api";
import { queryKeys } from "@/shared/query/query-keys";
import { toast } from "@/shared/lib/toast";
import { getErrorMessage } from "@/shared/errors/get-error-message";
import type {
  CreateWebhookFormValues,
  UpdateWebhookFormValues,
} from "@/features/webhooks/schemas/webhook.schemas";

export function useCreateWebhook(applicationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateWebhookFormValues) => webhooksApi.create(applicationId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.webhooks.list(applicationId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.webhooks.stats(applicationId) });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useUpdateWebhook(applicationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ webhookId, body }: { webhookId: string; body: UpdateWebhookFormValues }) =>
      webhooksApi.update(applicationId, webhookId, body),
    onSuccess: () => {
      toast.success("Webhook updated.");
      queryClient.invalidateQueries({ queryKey: queryKeys.webhooks.list(applicationId) });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useDeleteWebhook(applicationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (webhookId: string) => webhooksApi.remove(applicationId, webhookId),
    onSuccess: () => {
      toast.success("Webhook deleted.");
      queryClient.invalidateQueries({ queryKey: queryKeys.webhooks.list(applicationId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.webhooks.stats(applicationId) });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useRegenerateWebhookSecret(applicationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (webhookId: string) => webhooksApi.regenerateSecret(applicationId, webhookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.webhooks.list(applicationId) });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useSendTestPing(applicationId: string) {
  return useMutation({
    mutationFn: (webhookId: string) => webhooksApi.sendTestPing(applicationId, webhookId),
    onSuccess: (data) => {
      if (data.success) toast.success(data.message || "Test event delivered.");
      else toast.error(data.message || "Test event failed to deliver.");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}