import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
  signupSchema,
  type SignupFormValues,
} from "@/features/auth/schemas/auth.schemas";
import { useSignup } from "@/features/auth/mutations/use-signup";
import { getErrorMessage } from "@/shared/errors/get-error-message";
import { ROUTES } from "@/shared/config/routes";
import {
  parseOAuthAuthorizeParams,
  storePendingOAuthParams,
} from "@/shared/auth/Oauth";

export default function SignupPage() {
  const location = useLocation();
  const signup = useSignup();
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { username: "", email: "", password: "" },
  });

  // Someone can land here straight from GET /oauth/authorize too (e.g. it
  // bounced them to /login and they clicked "Sign up" instead). Persist
  // the pending authorize request the same way login does, so it survives
  // email verification and the eventual sign-in.
  const oauthParams = parseOAuthAuthorizeParams(location.search);

  useEffect(() => {
    if (oauthParams) storePendingOAuthParams(location.search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  function onSubmit(values: SignupFormValues) {
    signup.mutate(values, {
      onSuccess: () => setSubmittedEmail(values.email),
    });
  }

  if (submittedEmail) {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <CheckCircle2 className="mb-2 size-10 text-emerald-500" />
          <CardTitle className="text-xl">Check your email</CardTitle>
          <CardDescription>
            We sent a verification link to <strong>{submittedEmail}</strong>.
            Click it to activate your account, then sign in.
            {oauthParams &&
              " Once you're verified and signed in, you'll be sent back to finish connecting the app."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            render={<Link to={{ pathname: ROUTES.login, search: location.search }} />}
            className="w-full"
          >
            Back to sign in
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Create an account</CardTitle>
        <CardDescription>
          {oauthParams
            ? "Create an account to continue — you'll be redirected back after signing in."
            : "Get started with Aegis in a few seconds."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
            noValidate
          >
            {signup.isError && (
              <Alert variant="destructive">
                <AlertDescription>{getErrorMessage(signup.error)}</AlertDescription>
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" autoComplete="email" {...field} />
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
                  <FormLabel>Password</FormLabel>
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

            <Button type="submit" className="mt-2 w-full" disabled={signup.isPending}>
              {signup.isPending && <Spinner />}
              Create account
            </Button>
          </form>
        </Form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to={{ pathname: ROUTES.login, search: location.search }}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}