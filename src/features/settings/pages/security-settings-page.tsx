import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Fingerprint, Monitor } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { Spinner } from "@/shared/components/ui/spinner";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/forms/form";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "@/features/auth/schemas/auth.schemas";
import { Switch } from "@/shared/components/ui/switch";
import { useChangePassword } from "@/features/auth/mutations/use-change-password";
import { useLogoutAll } from "@/features/auth/mutations/use-logout";
import { getErrorMessage } from "@/shared/errors/get-error-message";
import { toast } from "@/shared/lib/toast";
import { ROUTES } from "@/shared/config/routes";
import { useProfilePreferencesStore } from "@/features/settings/store/profile-preferences";

export default function SecuritySettingsPage() {
  const changePassword = useChangePassword();
  const logoutAll = useLogoutAll();
  const { twoFactorEnabled, setTwoFactorEnabled, markPasswordChanged } =
    useProfilePreferencesStore();

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
  });

  function onSubmit(values: ChangePasswordFormValues) {
    changePassword.mutate(values, {
      onSuccess: () => {
        toast.success("Password changed.");
        markPasswordChanged();
        form.reset();
      },
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Change password</CardTitle>
          <CardDescription>
            Choose a strong password you don&apos;t use anywhere else.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex max-w-sm flex-col gap-4"
              noValidate
            >
              {changePassword.isError && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {getErrorMessage(changePassword.error)}
                  </AlertDescription>
                </Alert>
              )}

              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current password</FormLabel>
                    <FormControl>
                      <Input type="password" autoComplete="current-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New password</FormLabel>
                    <FormControl>
                      <Input type="password" autoComplete="new-password" {...field} />
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
                    <FormLabel>Confirm new password</FormLabel>
                    <FormControl>
                      <Input type="password" autoComplete="new-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-fit" disabled={changePassword.isPending}>
                {changePassword.isPending && <Spinner />}
                Update password
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>
            Add an extra layer of security to your account when signing in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-3">
            <div className="flex items-center gap-3">
              <Fingerprint className="size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Authenticator app</p>
                <p className="text-xs text-muted-foreground">
                  {twoFactorEnabled
                    ? "Enabled for this account."
                    : "Not yet enforced by the backend — this only reflects locally."}
                </p>
              </div>
            </div>
            <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sessions</CardTitle>
          <CardDescription>
            Manage devices signed in to your account, or end every session at once.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant="outline" render={<Link to={ROUTES.sessions} />}>
            <Monitor />
            View sessions
          </Button>
          <ConfirmDialog
            trigger={<Button variant="destructive">Log out everywhere</Button>}
            title="Log out of all devices?"
            description="This will end every active session, including this one. You'll need to sign in again."
            confirmLabel="Log out everywhere"
            isPending={logoutAll.isPending}
            onConfirm={() => logoutAll.mutate()}
          />
        </CardContent>
      </Card>
    </div>
  );
}