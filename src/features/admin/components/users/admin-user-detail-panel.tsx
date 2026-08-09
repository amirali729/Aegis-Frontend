import { useState } from "react";
import { X } from "lucide-react";

import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ErrorState } from "@/shared/components/error-state";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { useFormattedDateTime } from "@/shared/timezone/format";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { can } from "@/shared/permissions/can";
import { PLATFORM_OWNER_ONLY_PERMISSION } from "@/features/admin/constants/admin-permissions";
import { useAdminUser, useUpdateAdminUser } from "@/features/admin/queries/use-admin-users";
import type { PlatformRole } from "@/features/admin/types/admin.types";
import { AdminUserSessionsTab } from "@/features/admin/components/users/admin-user-sessions-tab";
import { AdminUserAuditLogsTab } from "@/features/admin/components/users/admin-user-audit-logs-tab";

type DetailTab = "overview" | "organizations" | "sessions" | "audit-logs";

const TABS: { value: DetailTab; label: string }[] = [
  { value: "overview", label: "Overview" },
  { value: "organizations", label: "Organizations" },
  { value: "sessions", label: "Sessions" },
  { value: "audit-logs", label: "Audit Logs" },
];

export function AdminUserDetailPanel({ userId, onClose }: { userId: string; onClose: () => void }) {
  const [tab, setTab] = useState<DetailTab>("overview");
  const [pendingRole, setPendingRole] = useState<PlatformRole | null>(null);

  const currentUser = useAuthStore((state) => state.user);
  const isOwner = can(currentUser, PLATFORM_OWNER_ONLY_PERMISSION);

  const userQuery = useAdminUser(userId);
  const updateUser = useUpdateAdminUser(userId);

  // Hooks must run unconditionally on every render — compute both
  // formatted dates up front (fed `null` when the user/lockUntil isn't
  // loaded yet) rather than calling useFormattedDateTime() after an
  // early return or inside conditional JSX.
  const joined = useFormattedDateTime(userQuery.data?.createdAt ?? null);
  const lockedUntil = useFormattedDateTime(userQuery.data?.lockUntil ?? null);

  if (userQuery.isPending) {
    return (
      <Card className="p-4">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="mt-3 h-5 w-32" />
        <Skeleton className="mt-2 h-4 w-48" />
      </Card>
    );
  }

  if (userQuery.isError) {
    return (
      <Card className="p-4">
        <ErrorState error={userQuery.error} onRetry={() => userQuery.refetch()} />
      </Card>
    );
  }

  const user = userQuery.data;

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <div className="flex items-start justify-between gap-2 border-b border-border p-4">
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            <AvatarFallback>{(user.fullName ?? user.username).slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{user.fullName ?? user.username}</p>
            <Badge variant={user.status === "active" ? "success" : "secondary"} className="mt-0.5 capitalize">
              {user.status}
            </Badge>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
          <X />
        </Button>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as DetailTab)}>
        <div className="border-b border-border px-4 pt-3">
          <TabsList>
            {TABS.map((item) => (
              <TabsTrigger key={item.value} value={item.value}>
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>

      {tab === "overview" && (
        <CardContent className="flex flex-col gap-5 p-4">
          <div>
            <p className="mb-2 text-sm font-semibold">User Information</p>
            <dl className="grid grid-cols-1 gap-2.5 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Username</dt>
                <dd className="font-medium">{user.username}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Email</dt>
                <dd className="font-medium">{user.email}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">User ID</dt>
                <dd className="font-mono text-xs">{user.id}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Joined</dt>
                <dd className="font-medium">{joined.dateTime}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Email verified</dt>
                <dd className="font-medium">{user.isVerified ? "Yes" : "No"}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Failed login attempts</dt>
                <dd className="font-medium">{user.failedLoginAttempts}</dd>
              </div>
              {user.lockUntil && (
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Locked until</dt>
                  <dd className="font-medium text-destructive">{lockedUntil.dateTime}</dd>
                </div>
              )}
            </dl>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold">Platform Role</p>
            {isOwner ? (
              <Select
                value={user.platformRole}
                onValueChange={(v) => v && setPendingRole(v as PlatformRole)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge variant="outline" className="capitalize">
                {user.platformRole}
              </Badge>
            )}
            {!isOwner && (
              <p className="mt-1.5 text-xs text-muted-foreground">
                Only the platform Owner can change platform roles.
              </p>
            )}
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold">Quick Actions</p>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() =>
                updateUser.mutate({ status: user.status === "active" ? "deactivated" : "active" })
              }
              disabled={updateUser.isPending}
            >
              {user.status === "active" ? "Deactivate user" : "Activate user"}
            </Button>
          </div>

          <ConfirmDialog
            open={pendingRole !== null}
            onOpenChange={(open) => !open && setPendingRole(null)}
            title="Change platform role?"
            description={`This will change ${user.fullName ?? user.username}'s platform role to "${pendingRole}". This affects what they can access across the entire platform.`}
            confirmLabel="Change role"
            isPending={updateUser.isPending}
            onConfirm={() => {
              if (pendingRole) updateUser.mutate({ platformRole: pendingRole });
              setPendingRole(null);
            }}
          />
        </CardContent>
      )}

      {tab === "organizations" && (
        <CardContent className="flex flex-col gap-2 p-4">
          {user.organizations.length === 0 && (
            <p className="text-sm text-muted-foreground">Not a member of any organization.</p>
          )}
          {user.organizations.map((org) => (
            <div key={org.id} className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-medium">{org.name}</p>
                <p className="text-xs text-muted-foreground">{org.slug}</p>
              </div>
              <div className="flex gap-1">
                {org.roles.map((role) => (
                  <Badge key={role} variant="outline">
                    {role}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      )}

      {tab === "sessions" && <AdminUserSessionsTab userId={userId} />}
      {tab === "audit-logs" && <AdminUserAuditLogsTab userId={userId} />}
    </Card>
  );
}
