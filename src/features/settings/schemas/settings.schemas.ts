import { z } from "zod";

/**
 * Mirrors Auth_System `modules/settings/validation/settings.schemas.ts`
 * exactly, including the max lengths and URL requirements. Do not
 * loosen these — the backend rejects anything outside them.
 */
export const updateProfileSchema = z.object({
  bio: z.string().trim().max(500).optional(),
  avatarUrl: z
    .string()
    .trim()
    .url("Must be a valid URL.")
    .max(2048)
    .optional()
    .or(z.literal("")),
  jobTitle: z.string().trim().max(100).optional(),
  company: z.string().trim().max(100).optional(),
  website: z
    .string()
    .trim()
    .url("Must be a valid URL.")
    .max(200)
    .optional()
    .or(z.literal("")),
  location: z.string().trim().max(100).optional(),
});
export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;

const generalPreferencesSchema = z
  .object({
    timezone: z.string().trim().min(1).optional(),
    locale: z.string().trim().min(1).optional(),
    dateFormat: z.string().trim().min(1).optional(),
  })
  .optional();

const appearancePreferencesSchema = z
  .object({
    theme: z.enum(["light", "dark", "system"]).optional(),
    density: z.enum(["comfortable", "compact"]).optional(),
    fontSize: z.enum(["small", "medium", "large"]).optional(),
    reduceMotion: z.boolean().optional(),
  })
  .optional();

const notificationPreferencesSchema = z
  .object({
    emailEnabled: z.boolean().optional(),
    productUpdates: z.boolean().optional(),
    securityAlerts: z.boolean().optional(),
    marketingEmails: z.boolean().optional(),
    weeklyDigest: z.boolean().optional(),
    pushEnabled: z.boolean().optional(),
  })
  .optional();

const privacyPreferencesSchema = z
  .object({
    profileVisibility: z.enum(["public", "organization", "private"]).optional(),
    showEmail: z.boolean().optional(),
    showActivity: z.boolean().optional(),
    allowIndexing: z.boolean().optional(),
  })
  .optional();

const developerPreferencesSchema = z
  .object({
    apiAccessEnabled: z.boolean().optional(),
    betaFeaturesEnabled: z.boolean().optional(),
    showDeveloperTools: z.boolean().optional(),
  })
  .optional();

export const updatePreferencesSchema = z.object({
  general: generalPreferencesSchema,
  appearance: appearancePreferencesSchema,
  notifications: notificationPreferencesSchema,
  privacy: privacyPreferencesSchema,
  developer: developerPreferencesSchema,
});
export type UpdatePreferencesFormValues = z.infer<typeof updatePreferencesSchema>;

export const deleteAccountSchema = z.object({
  password: z.string().min(1, "Password is required."),
});
export type DeleteAccountFormValues = z.infer<typeof deleteAccountSchema>;
