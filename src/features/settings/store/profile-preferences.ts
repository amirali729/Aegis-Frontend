import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * `jobTitle`/`bio`/`avatarUrl` moved to real backend state — see
 * `features/settings/queries/use-settings.ts` (GET/PATCH
 * /settings/profile). What's left here has no backend equivalent:
 * there is no 2FA endpoint in Auth_System, and "last password change"
 * isn't returned by any response, so it's recorded locally the moment
 * a change-password mutation succeeds.
 */
interface ProfilePreferencesState {
  lastPasswordChangeAt: string | null;
  twoFactorEnabled: boolean;
  markPasswordChanged: () => void;
  setTwoFactorEnabled: (value: boolean) => void;
}

export const useProfilePreferencesStore = create<ProfilePreferencesState>()(
  persist(
    (set) => ({
      lastPasswordChangeAt: null,
      twoFactorEnabled: false,
      markPasswordChanged: () =>
        set({ lastPasswordChangeAt: new Date().toISOString() }),
      setTwoFactorEnabled: (twoFactorEnabled) => set({ twoFactorEnabled }),
    }),
    { name: "aegis:profile-preferences" },
  ),
);
