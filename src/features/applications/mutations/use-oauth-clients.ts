import { useMutation, useQueryClient } from "@tanstack/react-query";

import { oauthClientsApi } from "@/features/applications/api/oauth-clients.api";
import { queryKeys } from "@/shared/query/query-keys";
import { toast } from "@/shared/lib/toast";
import { getErrorMessage } from "@/shared/errors/get-error-message";
import type { CreateOAuthClientFormValues } from "@/features/applications/schemas/application.schemas";

export function useCreateOAuthClient(applicationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateOAuthClientFormValues) =>
      oauthClientsApi.create(applicationId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.applications.oauthClients(applicationId),
      });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useRegenerateOAuthClientSecret(applicationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (clientId: string) =>
      oauthClientsApi.regenerateSecret(applicationId, clientId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.applications.oauthClients(applicationId),
      });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useRevokeOAuthClient(applicationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (clientId: string) =>
      oauthClientsApi.revoke(applicationId, clientId),
    onSuccess: () => {
      toast.success("OAuth client deleted.");
      queryClient.invalidateQueries({
        queryKey: queryKeys.applications.oauthClients(applicationId),
      });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}