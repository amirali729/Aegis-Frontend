import { useMutation, useQueryClient } from "@tanstack/react-query";

import { invitationsApi } from "@/features/organizations/api/invitations.api";
import { queryKeys } from "@/shared/query/query-keys";
import { toast } from "@/shared/lib/toast";
import { getErrorMessage } from "@/shared/errors/get-error-message";
import type { InviteMemberFormValues } from "@/features/organizations/schemas/organization.schemas";

export function useInviteMember(orgId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: InviteMemberFormValues) =>
      invitationsApi.create(orgId, body),
    onSuccess: () => {
      toast.success("Invitation sent.");
      queryClient.invalidateQueries({
        queryKey: queryKeys.organizations.invitations(orgId),
      });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useRevokeInvitation(orgId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitationId: string) =>
      invitationsApi.revoke(orgId, invitationId),
    onSuccess: () => {
      toast.success("Invitation revoked.");
      queryClient.invalidateQueries({
        queryKey: queryKeys.organizations.invitations(orgId),
      });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}