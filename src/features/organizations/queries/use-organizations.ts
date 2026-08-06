import { useQuery } from "@tanstack/react-query";

import { organizationsApi } from "@/features/organizations/api/organizations.api";
import { membersApi } from "@/features/organizations/api/members.api";
import { invitationsApi } from "@/features/organizations/api/invitations.api";
import { queryKeys } from "@/shared/query/query-keys";

export function useOrganizations(enabled = true) {
  return useQuery({
    queryKey: queryKeys.organizations.list,
    queryFn: () => organizationsApi.list(),
    enabled,
  });
}

export function useOrganization(id: string) {
  return useQuery({
    queryKey: queryKeys.organizations.detail(id),
    queryFn: () => organizationsApi.get(id),
    enabled: Boolean(id),
  });
}

export function useMembers(orgId: string) {
  return useQuery({
    queryKey: queryKeys.organizations.members(orgId),
    queryFn: () => membersApi.list(orgId),
    enabled: Boolean(orgId),
  });
}

export function useInvitations(orgId: string) {
  return useQuery({
    queryKey: queryKeys.organizations.invitations(orgId),
    queryFn: () => invitationsApi.list(orgId),
    enabled: Boolean(orgId),
  });
}