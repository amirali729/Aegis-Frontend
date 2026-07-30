import { create } from "zustand";
import { persist } from "zustand/middleware";

import { appConfig } from "@/shared/config/app";
import {
  DEFAULT_DATE_FORMAT,
  DEFAULT_TIME_FORMAT,
  type SupportedLocale,
  type SupportedTimezone,
} from "@/shared/constants/localization";

interface LocalizationPreferences {
  timezone: SupportedTimezone | string;
  locale: SupportedLocale | string;
  dateFormat: string;
  timeFormat: string;
}

interface PreferencesState extends LocalizationPreferences {
  setTimezone: (timezone: string) => void;
  setLocale: (locale: string) => void;
  setDateFormat: (format: string) => void;
  setTimeFormat: (format: string) => void;
}

function detectBrowserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return appConfig.defaultTimezone;
  }
}

/**
 * Persisted user localization preferences. This is the single source
 * of truth every timezone conversion utility reads from — never
 * hardcode a timezone or locale elsewhere in the app.
 */
export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      timezone: detectBrowserTimezone(),
      locale: "en-US",
      dateFormat: DEFAULT_DATE_FORMAT,
      timeFormat: DEFAULT_TIME_FORMAT,
      setTimezone: (timezone) => set({ timezone }),
      setLocale: (locale) => set({ locale }),
      setDateFormat: (dateFormat) => set({ dateFormat }),
      setTimeFormat: (timeFormat) => set({ timeFormat }),
    }),
    { name: "aegis:preferences" },
  ),
);

/** Non-hook accessor for use outside React components (e.g. utils, interceptors). */
export function getCurrentTimezone(): string {
  return usePreferencesStore.getState().timezone;
}

export function getCurrentLocale(): string {
  return usePreferencesStore.getState().locale;
}