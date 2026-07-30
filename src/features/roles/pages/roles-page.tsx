import { ShieldCheck, Trash2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { useRoles } from "@/features/roles/queries/use-roles";
import { useDeleteRole } from "@/features/roles/mutations/use-role-actions";
import { CreateRoleDialog } from "@/features/roles/components/create-role-dialog";
import { EditRoleDialog } from "@/features/roles/components/edit-role-dialog";
import type { Role } from "@/features/roles/types/role.types";

function RoleRow({
  role,
  onDelete,
  isDeleting,
}: {
  role: Role;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-3">
      <div>
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">{role.name}</p>
          {role.isSystem && <Badge variant="secondary">System</Badge>}
        </div>
        <p className="text-xs text-muted-foreground">
          {role.description || "No description"} · {role.permissions.length}{" "}
          permission{role.permissions.length === 1 ? "" : "s"}
        </p>
      </div>
      <div className="flex items-center gap-1">
        <EditRoleDialog role={role} />
        {!role.isSystem && (
          <ConfirmDialog
            trigger={
              <Button variant="ghost" size="icon" aria-label="Delete role">
                <Trash2 className="text-destructive" />
              </Button>
            }
            title="Delete this role?"
            description={`Anyone assigned "${role.name}" will lose the permissions it grants.`}
            confirmLabel="Delete"
            isPending={isDeleting}
            onConfirm={() => onDelete(role.id)}
          />
        )}
      </div>
    </div>
  );
}

export default function RolesPage() {
  const rolesQuery = useRoles();
  const deleteRole = useDeleteRole();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Roles</h1>
          <p className="text-sm text-muted-foreground">
            Bundles of permissions that can be assigned to users.
          </p>
        </div>
        <CreateRoleDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All roles</CardTitle>
          <CardDescription>
            System roles (Admin/User) can&apos;t be renamed or deleted, but
            their permissions can still be adjusted.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {rolesQuery.isPending && (
            <>
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </>
          )}

          {rolesQuery.isError && (
            <ErrorState error={rolesQuery.error} onRetry={() => rolesQuery.refetch()} />
          )}

          {rolesQuery.isSuccess && rolesQuery.data.length === 0 && (
            <EmptyState icon={ShieldCheck} title="No roles yet" />
          )}

          {rolesQuery.isSuccess &&
            rolesQuery.data.map((role) => (
              <RoleRow
                key={role.id}
                role={role}
                onDelete={(id) => deleteRole.mutate(id)}
                isDeleting={
                  deleteRole.isPending && deleteRole.variables === role.id
                }
              />
            ))}
        </CardContent>
      </Card>
    </div>
  );
}