/**
 * Mirrors Auth_System `modules/settings/responses/*.ts` and
 * `modules/settings/model/user-settings.model.ts` exactly. Do not add
 * fields here that the backend doesn't return — see architecture.md
 * §30 (source of truth is backend source, not the UI we'd like to have).
 */

export interface Profile {
  userId: string;
  username: string;
  email: string;
  fullName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  jobTitle: string | null;
  company: string | null;
  website: string | null;
  location: string | null;
  updatedAt: string;
}

export type ThemePreference = "light" | "dark" | "system";
export type DensityPreference = "comfortable" | "compact";
export type FontSizePreference = "small" | "medium" | "large";
export type ProfileVisibility = "public" | "organization" | "private";

export interface GeneralPreferences {
  timezone: string;
  locale: string;
  dateFormat: string;
  defaultOrganizationId?: string;
}

export interface AppearancePreferences {
  theme: ThemePreference;
  density: DensityPreference;
  fontSize: FontSizePreference;
  reduceMotion: boolean;
}

export interface NotificationPreferences {
  emailEnabled: boolean;
  productUpdates: boolean;
  securityAlerts: boolean;
  marketingEmails: boolean;
  weeklyDigest: boolean;
  pushEnabled: boolean;
}

export interface PrivacyPreferences {
  profileVisibility: ProfileVisibility;
  showEmail: boolean;
  showActivity: boolean;
  allowIndexing: boolean;
}

export interface DeveloperPreferences {
  apiAccessEnabled: boolean;
  betaFeaturesEnabled: boolean;
  showDeveloperTools: boolean;
}

export interface Preferences {
  general: GeneralPreferences;
  appearance: AppearancePreferences;
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
  developer: DeveloperPreferences;
}

export interface ConnectedApp {
  id: string;
  provider: string;
  providerAccountId: string;
  scopes: string[];
  connectedAt: string;
}

export interface SettingsMessage {
  message: string;
}
