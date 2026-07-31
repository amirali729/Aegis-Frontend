import { KeyRound, Trash2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
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

const ACTION_VARIANT: Record<string, "success" | "blue" | "amber" | "destructive"> = {
  create: "success",
  read: "blue",
  update: "amber",
  delete: "destructive",
};

function ActionBadge({ action }: { action: string }) {
  const variant = ACTION_VARIANT[action];
  if (variant === "success") return <Badge variant="success">{action}</Badge>;
  if (variant === "destructive") return <Badge variant="destructive">{action}</Badge>;
  return (
    <Badge
      variant="outline"
      className={
        variant === "blue"
          ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400"
          : variant === "amber"
            ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400"
            : undefined
      }
    >
      {action}
    </Badge>
  );
}

function PermissionTableRow({
  permission,
  onDelete,
  isDeleting,
}: {
  permission: Permission;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}) {
  const created = useFormattedDateTime(permission.createdAt);
  const [resource, action] = permission.key.split(":");

  return (
    <TableRow>
      <TableCell>
        <code className="font-mono text-xs">{permission.key}</code>
      </TableCell>
      <TableCell className="text-muted-foreground">{resource}</TableCell>
      <TableCell>
        <ActionBadge action={action} />
      </TableCell>
      <TableCell className="max-w-xs truncate text-muted-foreground">
        {permission.description || "No description"}
      </TableCell>
      <TableCell className="text-muted-foreground">{created.date}</TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1">
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
      </TableCell>
    </TableRow>
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

      <Card className="gap-0 py-0">
        <CardHeader className="border-b border-border py-4">
          <CardTitle>All permissions</CardTitle>
          <CardDescription>
            Keys follow a resource:action format, e.g. &quot;invoice:view&quot;.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {permissionsQuery.isPending && (
            <div className="flex flex-col gap-2 p-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          )}

          {permissionsQuery.isError && (
            <div className="p-4">
              <ErrorState
                error={permissionsQuery.error}
                onRetry={() => permissionsQuery.refetch()}
              />
            </div>
          )}

          {permissionsQuery.isSuccess && permissionsQuery.data.length === 0 && (
            <div className="p-4">
              <EmptyState icon={KeyRound} title="No permissions yet" />
            </div>
          )}

          {permissionsQuery.isSuccess && permissionsQuery.data.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Permission</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissionsQuery.data.map((permission) => (
                  <PermissionTableRow
                    key={permission.id}
                    permission={permission}
                    onDelete={(id) => deletePermission.mutate(id)}
                    isDeleting={
                      deletePermission.isPending &&
                      deletePermission.variables === permission.id
                    }
                  />
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}