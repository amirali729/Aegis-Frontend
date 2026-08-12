import { apiGet, apiPatch, apiDelete, apiPost } from "@/shared/api/request";
import type {
  Profile,
  Preferences,
  ConnectedApp,
  SettingsMessage,
} from "@/features/settings/types/settings.types";
import type {
  UpdateProfileFormValues,
  UpdatePreferencesFormValues,
} from "@/features/settings/schemas/settings.schemas";

/**
 * Every path here is copied verbatim from Auth_System
 * `shared/api-endpoint/settings.api.endpoint.ts`. All routes act on
 * the caller's own account — no orgId/userId path params, matching
 * the backend's `router.use(verifyjwt)`-only gating.
 */
export const settingsApi = {
  getProfile() {
    return apiGet<Profile>("/settings/profile");
  },

  updateProfile(body: UpdateProfileFormValues) {
    return apiPatch<Profile>("/settings/profile", body);
  },

  getPreferences() {
    return apiGet<Preferences>("/settings/preferences");
  },

  updatePreferences(body: UpdatePreferencesFormValues) {
    return apiPatch<Preferences>("/settings/preferences", body);
  },

  listConnectedApps() {
    return apiGet<ConnectedApp[]>("/settings/connected-apps");
  },

  disconnectApp(provider: string) {
    return apiDelete<ConnectedApp[]>(`/settings/connected-apps/${provider}`);
  },

  deactivateAccount() {
    return apiPost<SettingsMessage>("/settings/deactivate");
  },

  reactivateAccount() {
    return apiPost<SettingsMessage>("/settings/reactivate");
  },

  deleteAccount(password: string) {
    return apiDelete<SettingsMessage>("/settings/account", { data: { password } });
  },
};
