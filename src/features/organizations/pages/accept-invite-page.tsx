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
import { z } from "zod";
import {
  passwordSchema,
  usernameSchema,
} from "@/shared/validators/auth-fields";
import { useAcceptInvitation } from "@/features/organizations/mutations/use-accept-invitation";
import { getErrorMessage } from "@/shared/errors/get-error-message";
import { ROUTES } from "@/shared/config/routes";

const acceptInviteSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
});
type AcceptInviteFormValues = z.infer<typeof acceptInviteSchema>;

export default function AcceptInvitePage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const acceptInvitation = useAcceptInvitation();
  const [done, setDone] = useState(false);

  const form = useForm<AcceptInviteFormValues>({
    resolver: zodResolver(acceptInviteSchema),
    defaultValues: { username: "", password: "" },
  });

  function onSubmit(values: AcceptInviteFormValues) {
    if (!token) return;
    acceptInvitation.mutate(
      { token, ...values },
      { onSuccess: () => setDone(true) },
    );
  }

  if (!token) {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Invalid invitation</CardTitle>
          <CardDescription>
            This invitation link is missing its token. Ask whoever invited
            you to send a new one.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (done) {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <CheckCircle2 className="mb-2 size-10 text-emerald-500" />
          <CardTitle className="text-xl">You&apos;re in</CardTitle>
          <CardDescription>
            Your account has been created and you&apos;ve joined the
            organization. Sign in to continue.
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
        <CardTitle className="text-xl">Accept invitation</CardTitle>
        <CardDescription>
          Choose a username and password to create your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
            noValidate
          >
            {acceptInvitation.isError && (
              <Alert variant="destructive">
                <AlertDescription>
                  {getErrorMessage(acceptInvitation.error)}
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

            <Button
              type="submit"
              className="mt-2 w-full"
              disabled={acceptInvitation.isPending}
            >
              {acceptInvitation.isPending && <Spinner />}
              Accept invitation
            </Button>
          </form>
        </Form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to={ROUTES.login}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}