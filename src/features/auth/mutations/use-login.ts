import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authApi } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/features/auth/store/auth-store";
import type { LoginFormValues } from "@/features/auth/schemas/auth.schemas";

export function useLogin() {
  const queryClient = useQueryClient();
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  return useMutation({
    mutationFn: (values: LoginFormValues) => authApi.login(values),
    onSuccess: (data) => {
      // Roles/permissions aren't in the login response yet (see integration
      // guide §4.1) — default to an empty list until a roles endpoint is
      // wired up for the current user. UI permission checks degrade safely.
      setAuthenticated({ ...data.user, permissions: [] });
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}