import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Building2, LogOut, UserX, PauseCircle } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/shared/forms/form";
import { Input } from "@/shared/components/ui/input";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { Spinner } from "@/shared/components/ui/spinner";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { can } from "@/shared/permissions/can";
import { useCurrentOrganization } from "@/features/settings/hooks/use-current-organization";
import { useDeleteOrganization } from "@/features/organizations/mutations/use-organization-actions";
import { useLogoutAll } from "@/features/auth/mutations/use-logout";
import {
  useDeactivateAccount,
  useDeleteAccount,
} from "@/features/settings/mutations/use-settings-actions";
import { deleteAccountSchema, type DeleteAccountFormValues } from "@/features/settings/schemas/settings.schemas";
import { getErrorMessage } from "@/shared/errors/get-error-message";
import { ROUTES } from "@/shared/config/routes";

function DeleteAccountDialog() {
  const [open, setOpen] = useState(false);
  const deleteAccount = useDeleteAccount();
  const navigate = useNavigate();

  const form = useForm<DeleteAccountFormValues>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: { password: "" },
  });

  function onSubmit(values: DeleteAccountFormValues) {
    deleteAccount.mutate(values.password, {
      onSuccess: () => {
        setOpen(false);
        navigate(ROUTES.login);
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="destructive">Delete account</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete your account?</DialogTitle>
          <DialogDescription>
            This permanently deletes your account. This cannot be undone.
            Confirm with your password.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
            noValidate
          >
            {deleteAccount.isError && (
              <Alert variant="destructive">
                <AlertDescription>{getErrorMessage(deleteAccount.error)}</AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" autoFocus autoComplete="current-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" variant="destructive" disabled={deleteAccount.isPending}>
                {deleteAccount.isPending && <Spinner />}
                Permanently delete account
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default function DangerZoneSettingsPage() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const { organization } = useCurrentOrganization();
  const deleteOrganization = useDeleteOrganization();
  const logoutAll = useLogoutAll();
  const deactivateAccount = useDeactivateAccount();

  const canDeleteOrg = can(user, "organization:delete");

  return (
    <div className="flex flex-col gap-6">
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            These actions are irreversible. Proceed with caution.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col divide-y divide-destructive/20">
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 first:pt-0">
            <div className="flex items-start gap-3">
              <LogOut className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Log out of all devices</p>
                <p className="text-xs text-muted-foreground">
                  Ends every active session for your account, including this one.
                </p>
              </div>
            </div>
            <ConfirmDialog
              trigger={<Button variant="destructive">Log out everywhere</Button>}
              title="Log out of all devices?"
              description="This will end every active session, including this one. You'll need to sign in again."
              confirmLabel="Log out everywhere"
              isPending={logoutAll.isPending}
              onConfirm={() => logoutAll.mutate()}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 py-4">
            <div className="flex items-start gap-3">
              <Building2 className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Delete organization</p>
                <p className="text-xs text-muted-foreground">
                  {organization
                    ? `Permanently deletes "${organization.name}" and everything in it — members, applications, roles, and audit history.`
                    : "No organization is currently selected."}
                </p>
              </div>
            </div>
            <ConfirmDialog
              trigger={
                <Button
                  variant="destructive"
                  disabled={!organization || !canDeleteOrg}
                >
                  Delete organization
                </Button>
              }
              title={`Delete ${organization?.name ?? "this organization"}?`}
              description="This action cannot be undone. This will permanently delete the organization and all of its data."
              confirmLabel="Delete organization"
              isPending={deleteOrganization.isPending}
              onConfirm={() => {
                if (!organization) return;
                deleteOrganization.mutate(organization.id, {
                  onSuccess: () => navigate(ROUTES.organizations),
                });
              }}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 py-4">
            <div className="flex items-start gap-3">
              <PauseCircle className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Deactivate account</p>
                <p className="text-xs text-muted-foreground">
                  Signs you out everywhere. Reactivate any time by logging back in and confirming.
                </p>
              </div>
            </div>
            <ConfirmDialog
              trigger={<Button variant="destructive">Deactivate account</Button>}
              title="Deactivate your account?"
              description="You'll be signed out of every device. You can reactivate later."
              confirmLabel="Deactivate account"
              isPending={deactivateAccount.isPending}
              onConfirm={() => {
                deactivateAccount.mutate(undefined, {
                  onSuccess: () => navigate(ROUTES.login),
                });
              }}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 py-4 last:pb-0">
            <div className="flex items-start gap-3">
              <UserX className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Delete account</p>
                <p className="text-xs text-muted-foreground">
                  Permanently deletes your account and its data. This cannot be undone.
                </p>
              </div>
            </div>
            <DeleteAccountDialog />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
