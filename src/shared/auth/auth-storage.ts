import { AUTH_STORAGE_KEY } from "@/shared/auth/auth-constants";
import { localStorageHelper } from "@/shared/storage/local-storage";

/**
 * Tokens are httpOnly cookies and never touch JS. This cache only ever
 * holds the non-sensitive user object returned by login/signup, so the
 * UI can paint instantly on reload while the session is re-validated
 * in the background (see features/auth/hooks/use-bootstrap-session.ts).
 *
 * Generic by design: shared code must never import feature types
 * (see 03-Shared-Architecture.md, Rule 1), so the auth feature supplies
 * its own `AuthUser` type as the generic parameter at the call site.
 */
export const authStorage = {
  getUser<TUser>(): TUser | null {
    return localStorageHelper.get<TUser>(AUTH_STORAGE_KEY);
  },

  setUser<TUser>(user: TUser): void {
    localStorageHelper.set(AUTH_STORAGE_KEY, user);
  },

  clearUser(): void {
    localStorageHelper.remove(AUTH_STORAGE_KEY);
  },
};