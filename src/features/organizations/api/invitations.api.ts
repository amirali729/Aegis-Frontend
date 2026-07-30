import { apiDelete, apiGet, apiPost } from "@/shared/api/request";
import type { Invitation } from "@/features/organizations/types/organization.types";
import type { InviteMemberFormValues } from "@/features/organizations/schemas/organization.schemas";

export const invitationsApi = {
  list(orgId: string) {
    return apiGet<Invitation[]>(`/organizations/${orgId}/invitations`);
  },

  create(orgId: string, body: InviteMemberFormValues) {
    return apiPost<Invitation>(`/organizations/${orgId}/invitations`, body);
  },

  revoke(orgId: string, invitationId: string) {
    return apiDelete<{ message: string }>(
      `/organizations/${orgId}/invitations/${invitationId}`,
    );
  },
};

/** Public — no auth. Called from the "accept invite" page. */
export const acceptInvitationApi = {
  accept(body: { token: string; username?: string; password?: string }) {
    return apiPost<{
      organizationId: string;
      userId: string;
      message: string;
    }>("/invitations/accept", body);
  },
};