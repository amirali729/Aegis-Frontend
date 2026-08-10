import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import { Textarea } from "@/shared/components/ui/textarea";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ErrorState } from "@/shared/components/error-state";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { can } from "@/shared/permissions/can";
import { PLATFORM_OWNER_ONLY_PERMISSION } from "@/features/admin/constants/admin-permissions";
import {
  useAdminSystemSettings,
  useUpdateAdminSystemSettings,
} from "@/features/admin/queries/use-admin-system-settings";
import { useFormattedDateTime } from "@/shared/timezone/format";
import type { UpdateSystemSettingsPayload } from "@/features/admin/types/admin.types";

export default function AdminSystemSettingsPage() {
  const currentUser = useAuthStore((state) => state.user);
  const isOwner = can(currentUser, PLATFORM_OWNER_ONLY_PERMISSION);

  const settingsQuery = useAdminSystemSettings();
  const updateSettings = useUpdateAdminSystemSettings();

  const [form, setForm] = useState<UpdateSystemSettingsPayload | null>(null);
  const updatedAt = useFormattedDateTime(settingsQuery.data?.updatedAt ?? null);

  useEffect(() => {
    if (settingsQuery.data) {
      const { allowSignups, maintenanceMode, maintenanceMessage, defaultOrganizationPlan, supportEmail } =
        settingsQuery.data;
      setForm({ allowSignups, maintenanceMode, maintenanceMessage, defaultOrganizationPlan, supportEmail });
    }
  }, [settingsQuery.data]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">System Settings</h1>
        <p className="text-sm text-muted-foreground">
          Platform-wide configuration.
          {settingsQuery.data && ` Last updated ${updatedAt.dateTime}.`}
        </p>
      </div>

      {settingsQuery.isPending && (
        <Card>
          <CardContent className="flex flex-col gap-4 pt-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      )}

      {settingsQuery.isError && (
        <Card>
          <CardContent className="pt-6">
            <ErrorState error={settingsQuery.error} onRetry={() => settingsQuery.refetch()} />
          </CardContent>
        </Card>
      )}

      {settingsQuery.isSuccess && form && (
        <>
          {!isOwner && (
            <Alert>
              <AlertDescription>
                You can view system settings, but only the platform Owner can change them.
              </AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Signups</CardTitle>
              <CardDescription>Control whether new accounts can be created.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <Label>Allow new signups</Label>
                <p className="text-sm text-muted-foreground">
                  When off, the signup page rejects new account creation.
                </p>
              </div>
              <Switch
                checked={form.allowSignups}
                disabled={!isOwner}
                onCheckedChange={(checked) => setForm({ ...form, allowSignups: checked === true })}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Maintenance Mode</CardTitle>
              <CardDescription>Show a maintenance banner and restrict access platform-wide.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <Label>Maintenance mode</Label>
                <Switch
                  checked={form.maintenanceMode}
                  disabled={!isOwner}
                  onCheckedChange={(checked) => setForm({ ...form, maintenanceMode: checked === true })}
                />
              </div>
              <div className="grid gap-1.5">
                <Label>Maintenance message</Label>
                <Textarea
                  value={form.maintenanceMessage ?? ""}
                  disabled={!isOwner}
                  onChange={(event) => setForm({ ...form, maintenanceMessage: event.target.value })}
                  placeholder="We'll be back shortly..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Defaults</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label>Default organization plan</Label>
                <Input
                  value={form.defaultOrganizationPlan ?? ""}
                  disabled={!isOwner}
                  onChange={(event) => setForm({ ...form, defaultOrganizationPlan: event.target.value })}
                />
              </div>
              <div className="grid gap-1.5">
                <Label>Support email</Label>
                <Input
                  type="email"
                  value={form.supportEmail ?? ""}
                  disabled={!isOwner}
                  onChange={(event) => setForm({ ...form, supportEmail: event.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {isOwner && (
            <div className="flex justify-end">
              <Button onClick={() => updateSettings.mutate(form)} disabled={updateSettings.isPending}>
                Save changes
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}