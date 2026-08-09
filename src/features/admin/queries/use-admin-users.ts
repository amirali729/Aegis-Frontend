import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";

import { adminApi } from "@/features/admin/api/admin.api";
import { queryKeys } from "@/shared/query/query-keys";
import { toast } from "@/shared/lib/toast";
import { getErrorMessage } from "@/shared/errors/get-error-message";
import type { AdminUserFilters, UpdateAdminUserPayload } from "@/features/admin/types/admin.types";

export function useAdminUsers(filters: AdminUserFilters) {
  return useQuery({
    queryKey: queryKeys.admin.users(filters),
    queryFn: () => adminApi.getUsers(filters),
    placeholderData: keepPreviousData,
  });
}

export function useAdminUser(id: string) {
  return useQuery({
    queryKey: queryKeys.admin.userDetail(id),
    queryFn: () => adminApi.getUser(id),
    enabled: Boolean(id),
  });
}

export function useUpdateAdminUser(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateAdminUserPayload) => adminApi.updateUser(id, body),
    onSuccess: () => {
      toast.success("User updated.");
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.userDetail(id) });
      queryClient.invalidateQueries({ queryKey: ["admin", "users"], exact: false });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useAdminUserSessions(userId: string) {
  return useQuery({
    queryKey: queryKeys.admin.userSessions(userId),
    queryFn: () => adminApi.getUserSessions(userId),
    enabled: Boolean(userId),
  });
}

export function useRevokeAdminUserSession(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => adminApi.revokeUserSession(userId, sessionId),
    onSuccess: () => {
      toast.success("Session revoked.");
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.userSessions(userId) });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}
