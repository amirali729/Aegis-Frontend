/**
 * Per api-guide.md section 6, step 8 (the guide's own recommended
 * pattern): "only render this navigation item at all if
 * permissions.includes('user:view') or similar." `user:view` is granted
 * to platform roles owner/admin/support and never to a regular `user`
 * (see the table in section 4.1) — regular users don't get an org-role
 * grant of it either, since it's a platform-only permission key, not
 * part of the org-scoped catalog in 4.4. So gating the whole /admin
 * section behind this one permission is the confirmed, correct check —
 * no longer a guess.
 */
export const PLATFORM_ADMIN_PERMISSION = "user:view";

/**
 * Per api-guide.md 4.1: `system:settings:update` is granted to the
 * Owner platform role only (Admin does not get it). Since the frontend
 * only ever receives a flat `permissions` array — never the literal
 * `platformRole` string — checking for this permission is the correct,
 * guide-confirmed way to detect "the logged-in user is the platform
 * Owner" for gating Owner-only actions (e.g. changing someone's
 * platformRole in the admin Users page).
 */
export const PLATFORM_OWNER_ONLY_PERMISSION = "system:settings:update";
