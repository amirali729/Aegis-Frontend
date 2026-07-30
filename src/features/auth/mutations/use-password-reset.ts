import { useMutation } from "@tanstack/react-query";

import { authApi } from "@/features/auth/api/auth.api";
import type {
  ForgotPasswordFormValues,
  ResetPasswordFormValues,
} from "@/features/auth/schemas/auth.schemas";

export function useForgotPassword() {
  return useMutation({
    mutationFn: (values: ForgotPasswordFormValues) =>
      authApi.forgotPassword(values),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (values: ResetPasswordFormValues & { token: string }) =>
      authApi.resetPassword(values),
  });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (token: string) => authApi.verifyEmail({ token }),
  });
}

export function useResendVerification() {
  return useMutation({
    mutationFn: (email: string) => authApi.resendVerification({ email }),
  });
}