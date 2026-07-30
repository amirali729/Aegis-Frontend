import { useMutation, useQueryClient } from "@tanstack/react-query";

import { rolesApi } from "@/features/roles/api/roles.api";
import { queryKeys } from "@/shared/query/query-keys";
import { toast } from "@/shared/lib/toast";
import { getErrorMessage } from "@/shared/errors/get-error-message";
import type {
  CreateRoleFormValues,
  UpdateRoleFormValues,
} from "@/features/roles/schemas/role.schemas";

export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateRoleFormValues) => rolesApi.create(body),
    onSuccess: () => {
      toast.success("Role created.");
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.list });
    },
  });
}

export function useUpdateRole(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateRoleFormValues) => rolesApi.update(id, body),
    onSuccess: () => {
      toast.success("Role updated.");
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.list });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useReplaceRolePermissions(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (permissionIds: string[]) =>
      rolesApi.replacePermissions(id, permissionIds),
    onSuccess: () => {
      toast.success("Role permissions updated.");
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.list });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => rolesApi.remove(id),
    onSuccess: () => {
      toast.success("Role deleted.");
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.list });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}