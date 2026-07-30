import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authApi } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/features/auth/store/auth-store";

export function useLogout() {
  const queryClient = useQueryClient();
  const setUnauthenticated = useAuthStore((state) => state.setUnauthenticated);

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      // Clear regardless of success — if the request failed the cookie
      // is likely already invalid, so there's nothing to preserve.
      setUnauthenticated();
      queryClient.clear();
    },
  });
}

export function useLogoutAll() {
  const queryClient = useQueryClient();
  const setUnauthenticated = useAuthStore((state) => state.setUnauthenticated);

  return useMutation({
    mutationFn: () => authApi.logoutAll(),
    onSettled: () => {
      setUnauthenticated();
      queryClient.clear();
    },
  });
}