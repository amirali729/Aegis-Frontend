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
      setAuthenticated({ ...data.user, permissions: data.permissions });
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}