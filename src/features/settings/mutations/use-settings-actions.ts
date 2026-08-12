import { useMutation, useQueryClient } from "@tanstack/react-query";

import { settingsApi } from "@/features/settings/api/settings.api";
import { queryKeys } from "@/shared/query/query-keys";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { toast } from "@/shared/lib/toast";
import { getErrorMessage } from "@/shared/errors/get-error-message";
import type {
  UpdateProfileFormValues,
  UpdatePreferencesFormValues,
} from "@/features/settings/schemas/settings.schemas";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateProfileFormValues) => settingsApi.updateProfile(body),
    onSuccess: (profile) => {
      queryClient.setQueryData(queryKeys.settings.profile, profile);
      toast.success("Profile updated.");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useUpdatePreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdatePreferencesFormValues) => settingsApi.updatePreferences(body),
    onSuccess: (preferences) => {
      queryClient.setQueryData(queryKeys.settings.preferences, preferences);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useDisconnectApp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (provider: string) => settingsApi.disconnectApp(provider),
    onSuccess: (apps) => {
      queryClient.setQueryData(queryKeys.settings.connectedApps, apps);
      toast.success("App disconnected.");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

/**
 * Deactivation revokes every session server-side and clears the auth
 * cookies on the response (see `SettingsController.deactivateAccount`)
 * — so on success we tear down client auth state exactly like logout.
 */
export function useDeactivateAccount() {
  const queryClient = useQueryClient();
  const setUnauthenticated = useAuthStore((state) => state.setUnauthenticated);

  return useMutation({
    mutationFn: () => settingsApi.deactivateAccount(),
    onSuccess: () => {
      setUnauthenticated();
      queryClient.clear();
      toast.success("Account deactivated.");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useReactivateAccount() {
  return useMutation({
    mutationFn: () => settingsApi.reactivateAccount(),
    onSuccess: () => toast.success("Account reactivated."),
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

/** Deletion also clears auth cookies server-side on success — same teardown as deactivate. */
export function useDeleteAccount() {
  const queryClient = useQueryClient();
  const setUnauthenticated = useAuthStore((state) => state.setUnauthenticated);

  return useMutation({
    mutationFn: (password: string) => settingsApi.deleteAccount(password),
    onSuccess: () => {
      setUnauthenticated();
      queryClient.clear();
      toast.success("Account deleted.");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}
