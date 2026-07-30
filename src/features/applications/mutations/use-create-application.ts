import { useMutation, useQueryClient } from "@tanstack/react-query";

import { applicationsApi } from "@/features/applications/api/applications.api";
import { queryKeys } from "@/shared/query/query-keys";
import type { CreateApplicationPayload } from "@/features/applications/schemas/application.schemas";

export function useCreateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateApplicationPayload) =>
      applicationsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.list });
    },
  });
}