import { useMutation } from "@tanstack/react-query";

import { authApi } from "@/features/auth/api/auth.api";
import type { SignupFormValues } from "@/features/auth/schemas/auth.schemas";

export function useSignup() {
  return useMutation({
    mutationFn: (values: SignupFormValues) => authApi.signup(values),
  });
}