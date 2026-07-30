import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiKeysApi } from "@/features/applications/api/api-keys.api";
import { queryKeys } from "@/shared/query/query-keys";
import { toast } from "@/shared/lib/toast";
import { getErrorMessage } from "@/shared/errors/get-error-message";
import type { CreateApiKeyFormValues } from "@/features/applications/schemas/application.schemas";

export function useCreateApiKey(applicationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateApiKeyFormValues) =>
      apiKeysApi.create(applicationId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.applications.apiKeys(applicationId),
      });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useRevokeApiKey(applicationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (keyId: string) => apiKeysApi.revoke(applicationId, keyId),
    onSuccess: () => {
      toast.success("API key revoked.");
      queryClient.invalidateQueries({
        queryKey: queryKeys.applications.apiKeys(applicationId),
      });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}