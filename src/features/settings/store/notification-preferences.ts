import { create } from "zustand";
import { persist } from "zustand/middleware";

interface NotificationPreferencesState {
  emailSecurityAlerts: boolean;
  emailProductUpdates: boolean;
  emailWeeklyDigest: boolean;
  emailInvitations: boolean;
  inAppMentions: boolean;
  inAppAuditAlerts: boolean;
  toggle: (key: keyof Omit<NotificationPreferencesState, "toggle">) => void;
}

export const useNotificationPreferencesStore =
  create<NotificationPreferencesState>()(
    persist(
      (set) => ({
        emailSecurityAlerts: true,
        emailProductUpdates: false,
        emailWeeklyDigest: true,
        emailInvitations: true,
        inAppMentions: true,
        inAppAuditAlerts: true,
        toggle: (key) => set((state) => ({ [key]: !state[key] }) as never),
      }),
      { name: "aegis:notification-preferences" },
    ),
  );