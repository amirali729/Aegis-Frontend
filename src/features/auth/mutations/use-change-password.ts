import { useMutation } from "@tanstack/react-query";

import { authApi } from "@/features/auth/api/auth.api";
import type { ChangePasswordFormValues } from "@/features/auth/schemas/auth.schemas";

export function useChangePassword() {
  return useMutation({
    mutationFn: (values: ChangePasswordFormValues) => authApi.changePassword(values),
  });
}