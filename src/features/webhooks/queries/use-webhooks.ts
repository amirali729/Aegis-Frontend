import { useQuery } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";

import { webhooksApi, type DeliveryListParams } from "@/features/webhooks/api/webhooks.api";
import { queryKeys } from "@/shared/query/query-keys";

export function useWebhooks(applicationId: string) {
  return useQuery({
    queryKey: queryKeys.webhooks.list(applicationId),
    queryFn: () => webhooksApi.list(applicationId),
    enabled: Boolean(applicationId),
  });
}

export function useWebhookStats(applicationId: string) {
  return useQuery({
    queryKey: queryKeys.webhooks.stats(applicationId),
    queryFn: () => webhooksApi.stats(applicationId),
    enabled: Boolean(applicationId),
  });
}

export function useWebhookDeliveries(applicationId: string, params: DeliveryListParams) {
  return useQuery({
    queryKey: queryKeys.webhooks.deliveries(applicationId, params),
    queryFn: () => webhooksApi.deliveries(applicationId, params),
    placeholderData: keepPreviousData,
    enabled: Boolean(applicationId),
  });
}