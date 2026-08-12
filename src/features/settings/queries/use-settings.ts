import { useQuery } from "@tanstack/react-query";

import { settingsApi } from "@/features/settings/api/settings.api";
import { queryKeys } from "@/shared/query/query-keys";

export function useProfile() {
  return useQuery({
    queryKey: queryKeys.settings.profile,
    queryFn: () => settingsApi.getProfile(),
  });
}

export function usePreferences() {
  return useQuery({
    queryKey: queryKeys.settings.preferences,
    queryFn: () => settingsApi.getPreferences(),
  });
}

export function useConnectedApps() {
  return useQuery({
    queryKey: queryKeys.settings.connectedApps,
    queryFn: () => settingsApi.listConnectedApps(),
  });
}
