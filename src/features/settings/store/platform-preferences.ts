import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PlatformPreferencesState {
  allowNewRegistrations: boolean;
  requireEmailVerification: boolean;
  enforceStrongPasswords: boolean;
  sessionExpirationDays: string;
  toggle: (key: "allowNewRegistrations" | "requireEmailVerification" | "enforceStrongPasswords") => void;
  setSessionExpirationDays: (value: string) => void;
}

export const usePlatformPreferencesStore = create<PlatformPreferencesState>()(
  persist(
    (set) => ({
      allowNewRegistrations: true,
      requireEmailVerification: true,
      enforceStrongPasswords: true,
      sessionExpirationDays: "7",
      toggle: (key) => set((state) => ({ [key]: !state[key] }) as never),
      setSessionExpirationDays: (sessionExpirationDays) =>
        set({ sessionExpirationDays }),
    }),
    { name: "aegis:platform-preferences" },
  ),
);