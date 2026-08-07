import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { loginSchema, type LoginFormValues } from "@/features/auth/schemas/auth.schemas";
import { useLogin } from "@/features/auth/mutations/use-login";
import { getErrorMessage } from "@/shared/errors/get-error-message";
import { ApiError } from "@/shared/errors/api-error";
import { ROUTES } from "@/shared/config/routes";
import {
  parseOAuthAuthorizeParams,
  oauthAuthorizeUrl,
  storePendingOAuthParams,
  consumePendingOAuthParams,
  peekPendingOAuthParams,
} from "@/shared/auth/Oauth";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  // If the backend's GET /oauth/authorize bounced an unauthenticated
  // visitor here, its original query params are preserved on our own
  // URL. Detect that, persist it (it needs to survive a possible detour
  // through signup + email verification, which can happen in another
  // tab), and once logged in, send the full page back to the backend's
  // authorize endpoint (not an SPA route) so it can re-evaluate the
  // request now that the session cookie is set.
  const oauthParams = parseOAuthAuthorizeParams(location.search);

  useEffect(() => {
    if (oauthParams) storePendingOAuthParams(location.search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // Falls back to a pending flow stashed earlier (e.g. the visitor signed
  // up first) so the "continue" copy and redirect still work even when
  // this page was reached without the query string on its own URL.
  const hasPendingOAuth = Boolean(oauthParams) || Boolean(peekPendingOAuthParams());

  const redirectTo =
    (location.state as { from?: string } | null)?.from ?? ROUTES.dashboard;

  function onSubmit(values: LoginFormValues) {
    login.mutate(values, {
      onSuccess: () => {
        const pendingSearch = oauthParams
          ? location.search
          : consumePendingOAuthParams();
        if (pendingSearch) {
          window.location.href = oauthAuthorizeUrl(pendingSearch);
          return;
        }
        navigate(redirectTo, { replace: true });
      },
    });
  }

  const isLocked =
    login.error instanceof ApiError && login.error.isLocked;

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign in</CardTitle>
        <CardDescription>
          {hasPendingOAuth
            ? "Sign in to continue — you'll be redirected back automatically."
            : "Enter your username and password to access your account."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
            noValidate
          >
            {login.isError && (
              <Alert variant={isLocked ? "destructive" : "destructive"}>
                <AlertDescription>
                  {isLocked
                    ? "This account is temporarily locked due to too many failed attempts. Please try again in a few minutes."
                    : getErrorMessage(login.error)}
                </AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input autoComplete="username" autoFocus {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <Link
                      to={{ pathname: ROUTES.forgotPassword, search: location.search }}
                      className="text-sm text-muted-foreground underline-offset-4 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="mt-2 w-full" disabled={login.isPending}>
              {login.isPending && <Spinner />}
              Sign in
            </Button>
          </form>
        </Form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            to={{ pathname: ROUTES.signup, search: location.search }}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}