import { useMutation, useQueryClient } from "@tanstack/react-query";

import { permissionsApi } from "@/features/permissions/api/permissions.api";
import { queryKeys } from "@/shared/query/query-keys";
import { toast } from "@/shared/lib/toast";
import { getErrorMessage } from "@/shared/errors/get-error-message";
import type {
  CreatePermissionFormValues,
  UpdatePermissionFormValues,
} from "@/features/permissions/schemas/permission.schemas";

export function useCreatePermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreatePermissionFormValues) =>
      permissionsApi.create(body),
    onSuccess: () => {
      toast.success("Permission created.");
      queryClient.invalidateQueries({ queryKey: queryKeys.permissions.list });
    },
  });
}

export function useUpdatePermission(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdatePermissionFormValues) =>
      permissionsApi.update(id, body),
    onSuccess: () => {
      toast.success("Permission updated.");
      queryClient.invalidateQueries({ queryKey: queryKeys.permissions.list });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useDeletePermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => permissionsApi.remove(id),
    onSuccess: () => {
      toast.success("Permission deleted.");
      queryClient.invalidateQueries({ queryKey: queryKeys.permissions.list });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}