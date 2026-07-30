import { useMutation, useQueryClient } from "@tanstack/react-query";

import { membersApi } from "@/features/organizations/api/members.api";
import { queryKeys } from "@/shared/query/query-keys";
import { toast } from "@/shared/lib/toast";
import { getErrorMessage } from "@/shared/errors/get-error-message";

export function useSuspendMember(orgId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => membersApi.suspend(orgId, userId),
    onSuccess: () => {
      toast.success("Member suspended.");
      queryClient.invalidateQueries({
        queryKey: queryKeys.organizations.members(orgId),
      });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useReactivateMember(orgId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => membersApi.reactivate(orgId, userId),
    onSuccess: () => {
      toast.success("Member reactivated.");
      queryClient.invalidateQueries({
        queryKey: queryKeys.organizations.members(orgId),
      });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useRemoveMember(orgId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => membersApi.remove(orgId, userId),
    onSuccess: () => {
      toast.success("Member removed.");
      queryClient.invalidateQueries({
        queryKey: queryKeys.organizations.members(orgId),
      });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}