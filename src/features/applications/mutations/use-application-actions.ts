import { useMutation, useQueryClient } from "@tanstack/react-query";

import { applicationsApi } from "@/features/applications/api/applications.api";
import { queryKeys } from "@/shared/query/query-keys";
import { toast } from "@/shared/lib/toast";
import { getErrorMessage } from "@/shared/errors/get-error-message";
import type { Application } from "@/features/applications/types/application.types";

export function useUpdateApplication(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: Partial<Application>) =>
      applicationsApi.update(id, body),
    onSuccess: () => {
      toast.success("Application updated.");
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.list });
      queryClient.invalidateQueries({
        queryKey: queryKeys.applications.detail(id),
      });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useDeleteApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => applicationsApi.remove(id),
    onSuccess: () => {
      toast.success("Application deleted.");
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.list });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useRegenerateSecret(id: string) {
  return useMutation({
    mutationFn: () => applicationsApi.regenerateSecret(id),
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}