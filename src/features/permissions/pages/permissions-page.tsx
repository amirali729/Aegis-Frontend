import { KeyRound, Trash2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { useFormattedDateTime } from "@/shared/timezone/format";
import { usePermissions } from "@/features/permissions/queries/use-permissions";
import { useDeletePermission } from "@/features/permissions/mutations/use-permission-actions";
import { CreatePermissionDialog } from "@/features/permissions/components/create-permission-dialog";
import { EditPermissionDialog } from "@/features/permissions/components/edit-permission-dialog";
import type { Permission } from "@/features/permissions/types/permission.types";

function PermissionRow({
  permission,
  onDelete,
  isDeleting,
}: {
  permission: Permission;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}) {
  const created = useFormattedDateTime(permission.createdAt);

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-3">
      <div>
        <p className="text-sm font-medium">{permission.key}</p>
        <p className="text-xs text-muted-foreground">
          {permission.description || "No description"} · Created{" "}
          {created.date}
        </p>
      </div>
      <div className="flex items-center gap-1">
        <EditPermissionDialog permission={permission} />
        <ConfirmDialog
          trigger={
            <Button variant="ghost" size="icon" aria-label="Delete permission">
              <Trash2 className="text-destructive" />
            </Button>
          }
          title="Delete this permission?"
          description={`Any role granting "${permission.key}" will lose it immediately.`}
          confirmLabel="Delete"
          isPending={isDeleting}
          onConfirm={() => onDelete(permission.id)}
        />
      </div>
    </div>
  );
}

export default function PermissionsPage() {
  const permissionsQuery = usePermissions();
  const deletePermission = useDeletePermission();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Permissions</h1>
          <p className="text-sm text-muted-foreground">
            Fine-grained permission keys that roles are built from.
          </p>
        </div>
        <CreatePermissionDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All permissions</CardTitle>
          <CardDescription>
            Keys follow a resource:action format, e.g. "invoice:view".
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {permissionsQuery.isPending && (
            <>
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </>
          )}

          {permissionsQuery.isError && (
            <ErrorState
              error={permissionsQuery.error}
              onRetry={() => permissionsQuery.refetch()}
            />
          )}

          {permissionsQuery.isSuccess && permissionsQuery.data.length === 0 && (
            <EmptyState icon={KeyRound} title="No permissions yet" />
          )}

          {permissionsQuery.isSuccess &&
            permissionsQuery.data.map((permission) => (
              <PermissionRow
                key={permission.id}
                permission={permission}
                onDelete={(id) => deletePermission.mutate(id)}
                isDeleting={
                  deletePermission.isPending &&
                  deletePermission.variables === permission.id
                }
              />
            ))}
        </CardContent>
      </Card>
    </div>
  );
}