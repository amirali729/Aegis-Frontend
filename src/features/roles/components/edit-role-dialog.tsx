import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Spinner } from "@/shared/components/ui/spinner";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/forms/form";
import { usePermissions } from "@/features/permissions/queries/use-permissions";
import {
  updateRoleSchema,
  type UpdateRoleFormValues,
} from "@/features/roles/schemas/role.schemas";
import {
  useReplaceRolePermissions,
  useUpdateRole,
} from "@/features/roles/mutations/use-role-actions";
import { getErrorMessage } from "@/shared/errors/get-error-message";
import { PermissionPicker } from "@/features/roles/components/permission-picker";
import type { Role } from "@/features/roles/types/role.types";

export function EditRoleDialog({ role }: { role: Role }) {
  const [open, setOpen] = useState(false);
  const permissionsQuery = usePermissions();
  const updateRole = useUpdateRole(role.id);
  const replacePermissions = useReplaceRolePermissions(role.id);

  const currentPermissionIds =
    permissionsQuery.data
      ?.filter((permission) => role.permissions.includes(permission.key))
      .map((permission) => permission.id) ?? [];

  const [permissionIds, setPermissionIds] = useState<string[]>(
    currentPermissionIds,
  );

  const form = useForm<UpdateRoleFormValues>({
    resolver: zodResolver(updateRoleSchema),
    defaultValues: { name: role.name, description: role.description ?? "" },
  });

  function onSubmit(values: UpdateRoleFormValues) {
    updateRole.mutate(values);
    replacePermissions.mutate(permissionIds, {
      onSuccess: () => setOpen(false),
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setPermissionIds(currentPermissionIds);
      }}
    >
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="Edit role">
            <Pencil />
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit role</DialogTitle>
          {role.isSystem && (
            <DialogDescription>
              This is a system role — its name can&apos;t be changed, but you
              can still adjust its permissions.
            </DialogDescription>
          )}
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
            noValidate
          >
            {(updateRole.isError || replacePermissions.isError) && (
              <Alert variant="destructive">
                <AlertDescription>
                  {getErrorMessage(updateRole.error ?? replacePermissions.error)}
                </AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={role.isSystem} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-2">
              <Label>Permissions</Label>
              <PermissionPicker
                selectedIds={permissionIds}
                onChange={setPermissionIds}
              />
            </div>

            <DialogFooter>
              <Button
                type="submit"
                disabled={updateRole.isPending || replacePermissions.isPending}
              >
                {(updateRole.isPending || replacePermissions.isPending) && (
                  <Spinner />
                )}
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}