import { useMemo } from "react";

import { useOrganizations } from "@/features/organizations/queries/use-organizations";
import { getTenantId } from "@/shared/auth/tenant-context";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { can } from "@/shared/permissions/can";

/**
 * There is no "list my organizations" endpoint yet (see Integration
 * Guide §5/§9), so this is a best-effort resolution for Settings pages
 * that want to show/edit "the" current organization: prefer whatever
 * is stored as the active tenant, otherwise fall back to the first
 * organization the caller can see via GET /organizations (platform
 * `organization:view` only). Callers must still handle the "none
 * found" case in their UI.
 */
export function useCurrentOrganization() {
  const user = useAuthStore((state) => state.user);
  const canListOrganizations = can(user, "organization:view");

  const query = useOrganizations();
  const organizations = useMemo(
    () => (canListOrganizations ? (query.data ?? []) : []),
    [canListOrganizations, query.data],
  );

  const organization = useMemo(() => {
    if (organizations.length === 0) return null;
    const tenantId = getTenantId();
    return organizations.find((org) => org.id === tenantId) ?? organizations[0];
  }, [organizations]);

  return {
    organization,
    organizations,
    isLoading: canListOrganizations && query.isLoading,
    canListOrganizations,
  };
}