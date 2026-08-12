/**
 * Matches the exact permission strings already used to hide/show the
 * corresponding links in layouts/nav-items.ts. Kept as named constants
 * (rather than inline string literals in the router) so nav visibility
 * and route gating can't silently drift apart.
 *
 * These are org-scoped permission keys — separate from
 * PLATFORM_ADMIN_PERMISSION (see features/admin/constants/admin-permissions.ts).
 * Do not add new permission names here without confirming them against
 * Auth_System's DEFAULT_PERMISSIONS catalog first.
 */
export const ROLE_VIEW_PERMISSION = "role:view";
export const PERMISSION_VIEW_PERMISSION = "permission:view";
export const ORGANIZATION_VIEW_PERMISSION = "organization:view";
export const AUDIT_VIEW_PERMISSION = "audit:view";
