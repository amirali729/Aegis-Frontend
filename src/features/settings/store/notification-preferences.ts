import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * `emailSecurityAlerts`/`emailProductUpdates`/`emailWeeklyDigest` moved
 * to real backend state (`preferences.notifications` via GET/PATCH
 * /settings/preferences) — see `notifications-settings-page.tsx`.
 * What's left has no backend field to sync to.
 */
interface NotificationPreferencesState {
  emailInvitations: boolean;
  inAppMentions: boolean;
  inAppAuditAlerts: boolean;
  toggle: (key: keyof Omit<NotificationPreferencesState, "toggle">) => void;
}

export const useNotificationPreferencesStore =
  create<NotificationPreferencesState>()(
    persist(
      (set) => ({
        emailInvitations: true,
        inAppMentions: true,
        inAppAuditAlerts: true,
        toggle: (key) => set((state) => ({ [key]: !state[key] }) as never),
      }),
      { name: "aegis:notification-preferences" },
    ),
  );
