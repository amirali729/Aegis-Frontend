import { useMutation, useQueryClient } from "@tanstack/react-query";

import { rolesApi } from "@/features/roles/api/roles.api";
import { toast } from "@/shared/lib/toast";
import { getErrorMessage } from "@/shared/errors/get-error-message";

/**
 * Backend confirmed endpoints:
 *   POST   /organizations/:orgId/users/:userId/roles      { roleId }
 *   DELETE /organizations/:orgId/users/:userId/roles/:roleId
 * Both require `role:update` (Auth_System role.routes.ts).
 *
 * NOTE: GET /organizations/:orgId/members does not return each
 * member's current role(s) (Auth_System MemberResponse has no role
 * field) — there is no endpoint to fetch a member's current roles.
 * The `roles` array in the mutation response below is the only source
 * of that information the frontend has, and it only reflects actions
 * taken this session. See MembersSection for how this is surfaced
 * honestly instead of pretending to show persistent ground truth.
 */
export function useAssignRole(orgId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, roleId }: { userId: string; roleId: string }) =>
      rolesApi.assignToUser(orgId, userId, roleId),
    onSuccess: (result) => {
      toast.success(result.message || "Role assigned.");
      queryClient.invalidateQueries({ queryKey: ["organizations", "member-roles", orgId] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useRemoveRole(orgId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, roleId }: { userId: string; roleId: string }) =>
      rolesApi.removeFromUser(orgId, userId, roleId),
    onSuccess: (result) => {
      toast.success(result.message || "Role removed.");
      queryClient.invalidateQueries({ queryKey: ["organizations", "member-roles", orgId] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}
