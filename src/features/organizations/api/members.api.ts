import { apiDelete, apiGet, apiPatch } from "@/shared/api/request";
import type { Member } from "@/features/organizations/types/organization.types";

export const membersApi = {
  list(orgId: string) {
    return apiGet<Member[]>(`/organizations/${orgId}/members`);
  },

  suspend(orgId: string, userId: string) {
    return apiPatch<{ message: string }>(
      `/organizations/${orgId}/members/${userId}/suspend`,
    );
  },

  reactivate(orgId: string, userId: string) {
    return apiPatch<{ message: string }>(
      `/organizations/${orgId}/members/${userId}/reactivate`,
    );
  },

  remove(orgId: string, userId: string) {
    return apiDelete<{ message: string }>(
      `/organizations/${orgId}/members/${userId}`,
    );
  },
};