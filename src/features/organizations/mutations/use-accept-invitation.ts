import { useMutation } from "@tanstack/react-query";

import { acceptInvitationApi } from "@/features/organizations/api/invitations.api";

export function useAcceptInvitation() {
  return useMutation({
    mutationFn: (body: { token: string; username?: string; password?: string }) =>
      acceptInvitationApi.accept(body),
  });
}