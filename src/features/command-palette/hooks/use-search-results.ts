import { useMemo } from "react";
import { AppWindow, Building2, KeyRound, ShieldCheck } from "lucide-react";

import { useAuthStore } from "@/features/auth/store/auth-store";
import { can } from "@/shared/permissions/can";
import { ROUTES } from "@/shared/config/routes";
import { useOrganizations } from "@/features/organizations/queries/use-organizations";
import { useApplications } from "@/features/applications/queries/use-applications";
import { useRoles } from "@/features/roles/queries/use-roles";
import { usePermissions } from "@/features/permissions/queries/use-permissions";
import { buildStaticPageResults, type SearchResult } from "@/features/command-palette/lib/build-static-search-index";
import { NAV_ITEMS } from "@/layouts/nav-items";
import { SETTINGS_NAV } from "@/features/settings/settings-nav";

export function useSearchResults(isOpen: boolean) {
  const user = useAuthStore((state) => state.user);

  const canViewOrganizations = can(user, "organization:view");
  const canViewApplications = can(user, "application:view");
  const canViewRoles = can(user, "role:view");
  const canViewPermissions = can(user, "permission:view");

  const organizationsQuery = useOrganizations(isOpen && canViewOrganizations);
  const applicationsQuery = useApplications(isOpen && canViewApplications);
  const rolesQuery = useRoles(isOpen && canViewRoles);
  const permissionsQuery = usePermissions(isOpen && canViewPermissions);

  const results = useMemo<SearchResult[]>(() => {
    const permissionByHref = new Map(
      [...NAV_ITEMS, ...SETTINGS_NAV].map((item) => [item.href, item.permission]),
    );

    const pages = buildStaticPageResults().filter((page) => {
      const permission = permissionByHref.get(page.href);
      return !permission || can(user, permission);
    });

    const organizations: SearchResult[] = canViewOrganizations
      ? (organizationsQuery.data ?? []).map((org) => ({
          id: `org:${org.id}`,
          group: "Organizations" as const,
          label: org.name,
          description: org.slug,
          href: ROUTES.organizationDetails(org.id),
          icon: Building2,
          keywords: [org.slug],
        }))
      : [];

    const applications: SearchResult[] = canViewApplications
      ? (applicationsQuery.data ?? []).map((app) => ({
          id: `app:${app.id}`,
          group: "Applications" as const,
          label: app.name,
          href: ROUTES.applicationDetails(app.id),
          icon: AppWindow,
        }))
      : [];

    const roles: SearchResult[] = canViewRoles
      ? (rolesQuery.data ?? []).map((role) => ({
          id: `role:${role.id}`,
          group: "Roles" as const,
          label: role.name,
          description: role.description ?? undefined,
          href: ROUTES.roles,
          icon: ShieldCheck,
        }))
      : [];

    const permissions: SearchResult[] = canViewPermissions
      ? (permissionsQuery.data ?? []).map((permission) => ({
          id: `permission:${permission.id}`,
          group: "Permissions" as const,
          label: permission.key,
          description: permission.description ?? undefined,
          href: ROUTES.permissions,
          icon: KeyRound,
        }))
      : [];

    return [...pages, ...organizations, ...applications, ...roles, ...permissions];
  }, [
    user,
    canViewOrganizations,
    canViewApplications,
    canViewRoles,
    canViewPermissions,
    organizationsQuery.data,
    applicationsQuery.data,
    rolesQuery.data,
    permissionsQuery.data,
  ]);

  return {
    results,
    isLoading:
      isOpen &&
      ((canViewOrganizations && organizationsQuery.isLoading) ||
        (canViewApplications && applicationsQuery.isLoading) ||
        (canViewRoles && rolesQuery.isLoading) ||
        (canViewPermissions && permissionsQuery.isLoading)),
  };
}
