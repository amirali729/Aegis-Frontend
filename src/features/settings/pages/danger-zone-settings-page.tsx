import { useNavigate } from "react-router-dom";
import { Building2, LogOut, UserX } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { can } from "@/shared/permissions/can";
import { useCurrentOrganization } from "@/features/settings/hooks/use-current-organization";
import { useDeleteOrganization } from "@/features/organizations/mutations/use-organization-actions";
import { useLogoutAll } from "@/features/auth/mutations/use-logout";
import { ROUTES } from "@/shared/config/routes";

export default function DangerZoneSettingsPage() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const { organization } = useCurrentOrganization();
  const deleteOrganization = useDeleteOrganization();
  const logoutAll = useLogoutAll();

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

          <div className="flex flex-wrap items-center justify-between gap-4 py-4 last:pb-0">
            <div className="flex items-start gap-3">
              <UserX className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Delete account</p>
                <p className="text-xs text-muted-foreground">
                  Self-service account deletion isn&apos;t available yet —
                  contact support to permanently delete your account.
                </p>
              </div>
            </div>
            <Button variant="destructive" disabled title="Contact support to delete your account">
              Delete account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}