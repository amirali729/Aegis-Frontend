/**
 * These helpers are purely for UX (hiding/disabling UI, protecting
 * routes for a better experience). The backend remains the sole
 * authority — every request is still enforced server-side regardless
 * of what these functions return.
 */

export interface AuthorizedUser {
  permissions: string[];
}

export function hasPermission(
  user: AuthorizedUser | null | undefined,
  permission: string,
): boolean {
  if (!user) return false;
  return user.permissions.includes(permission);
}

export function hasAnyPermission(
  user: AuthorizedUser | null | undefined,
  permissions: string[],
): boolean {
  if (!user) return false;
  return permissions.some((permission) =>
    user.permissions.includes(permission),
  );
}

export function hasAllPermissions(
  user: AuthorizedUser | null | undefined,
  permissions: string[],
): boolean {
  if (!user) return false;
  return permissions.every((permission) =>
    user.permissions.includes(permission),
  );
}

/** Alias matching the naming used throughout the architecture docs. */
export const can = hasPermission;

export function cannot(
  user: AuthorizedUser | null | undefined,
  permission: string,
): boolean {
  return !can(user, permission);
}