import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { Spinner } from "@/shared/components/ui/spinner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/forms/form";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/features/auth/schemas/auth.schemas";
import { useResetPassword } from "@/features/auth/mutations/use-password-reset";
import { getErrorMessage } from "@/shared/errors/get-error-message";
import { ROUTES } from "@/shared/config/routes";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const resetPassword = useResetPassword();
  const [done, setDone] = useState(false);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  function onSubmit(values: ResetPasswordFormValues) {
    if (!token) return;
    resetPassword.mutate(
      { ...values, token },
      { onSuccess: () => setDone(true) },
    );
  }

  if (!token) {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Invalid link</CardTitle>
          <CardDescription>
            This password reset link is missing its token. Request a new one
            from the forgot password page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            render={<Link to={ROUTES.forgotPassword} />}
            className="w-full"
          >
            Request new link
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (done) {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <CheckCircle2 className="mb-2 size-10 text-emerald-500" />
          <CardTitle className="text-xl">Password reset</CardTitle>
          <CardDescription>
            Your password has been updated. You can now sign in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full"
            onClick={() => navigate(ROUTES.login, { replace: true })}
          >
            Continue to sign in
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Reset password</CardTitle>
        <CardDescription>Choose a new password for your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
            noValidate
          >
            {resetPassword.isError && (
              <Alert variant="destructive">
                <AlertDescription>
                  {getErrorMessage(resetPassword.error)}
                </AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      autoFocus
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="mt-2 w-full"
              disabled={resetPassword.isPending}
            >
              {resetPassword.isPending && <Spinner />}
              Reset password
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}