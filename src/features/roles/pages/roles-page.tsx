import { ShieldCheck, Trash2 } from "lucide-react";

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
import { useRoles } from "@/features/roles/queries/use-roles";
import { useDeleteRole } from "@/features/roles/mutations/use-role-actions";
import { CreateRoleDialog } from "@/features/roles/components/create-role-dialog";
import { EditRoleDialog } from "@/features/roles/components/edit-role-dialog";
import type { Role } from "@/features/roles/types/role.types";

function RoleTableRow({
  role,
  onDelete,
  isDeleting,
}: {
  role: Role;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400">
            <ShieldCheck className="size-4" />
          </span>
          <span className="font-medium">{role.name}</span>
          {role.isSystem && <Badge variant="secondary">System</Badge>}
        </div>
      </TableCell>
      <TableCell className="max-w-xs truncate text-muted-foreground">
        {role.description || "No description"}
      </TableCell>
      <TableCell>
        <Badge variant="outline">
          {role.permissions.length} permission{role.permissions.length === 1 ? "" : "s"}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1">
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
      </TableCell>
    </TableRow>
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

      <Card className="gap-0 py-0">
        <CardHeader className="border-b border-border py-4">
          <CardTitle>All roles</CardTitle>
          <CardDescription>
            System roles (Admin/User) can&apos;t be renamed or deleted, but their
            permissions can still be adjusted.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {rolesQuery.isPending && (
            <div className="flex flex-col gap-2 p-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          )}

          {rolesQuery.isError && (
            <div className="p-4">
              <ErrorState error={rolesQuery.error} onRetry={() => rolesQuery.refetch()} />
            </div>
          )}

          {rolesQuery.isSuccess && rolesQuery.data.length === 0 && (
            <div className="p-4">
              <EmptyState icon={ShieldCheck} title="No roles yet" />
            </div>
          )}

          {rolesQuery.isSuccess && rolesQuery.data.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rolesQuery.data.map((role) => (
                  <RoleTableRow
                    key={role.id}
                    role={role}
                    onDelete={(id) => deleteRole.mutate(id)}
                    isDeleting={deleteRole.isPending && deleteRole.variables === role.id}
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