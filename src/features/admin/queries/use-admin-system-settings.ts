import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { adminApi } from "@/features/admin/api/admin.api";
import { queryKeys } from "@/shared/query/query-keys";
import { toast } from "@/shared/lib/toast";
import { getErrorMessage } from "@/shared/errors/get-error-message";
import type { UpdateSystemSettingsPayload } from "@/features/admin/types/admin.types";

export function useAdminSystemSettings() {
  return useQuery({
    queryKey: queryKeys.admin.systemSettings,
    queryFn: () => adminApi.getSystemSettings(),
  });
}

export function useUpdateAdminSystemSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateSystemSettingsPayload) => adminApi.updateSystemSettings(body),
    onSuccess: () => {
      toast.success("System settings updated.");
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.systemSettings });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}