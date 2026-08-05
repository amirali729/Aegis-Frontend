import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Client-only profile fields. The Aegis backend's `UserResponse` only
 * has {id, username, email, createdAt} — there is no endpoint yet for
 * job title, bio, or avatar. These are stored locally so the Profile
 * page UI can be fully built out ahead of that backend work landing
 * (see docs/06-API-Integration.md "known gaps").
 */
interface ProfilePreferencesState {
  jobTitle: string;
  bio: string;
  avatarDataUrl: string | null;
  /** ISO timestamp, set locally whenever a password-change mutation succeeds. */
  lastPasswordChangeAt: string | null;
  twoFactorEnabled: boolean;
  setJobTitle: (value: string) => void;
  setBio: (value: string) => void;
  setAvatarDataUrl: (value: string | null) => void;
  markPasswordChanged: () => void;
  setTwoFactorEnabled: (value: boolean) => void;
}

export const useProfilePreferencesStore = create<ProfilePreferencesState>()(
  persist(
    (set) => ({
      jobTitle: "",
      bio: "",
      avatarDataUrl: null,
      lastPasswordChangeAt: null,
      twoFactorEnabled: false,
      setJobTitle: (jobTitle) => set({ jobTitle }),
      setBio: (bio) => set({ bio }),
      setAvatarDataUrl: (avatarDataUrl) => set({ avatarDataUrl }),
      markPasswordChanged: () =>
        set({ lastPasswordChangeAt: new Date().toISOString() }),
      setTwoFactorEnabled: (twoFactorEnabled) => set({ twoFactorEnabled }),
    }),
    { name: "aegis:profile-preferences" },
  ),
);