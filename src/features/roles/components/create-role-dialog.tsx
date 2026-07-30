import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
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
import {
  createRoleSchema,
  type CreateRoleFormValues,
} from "@/features/roles/schemas/role.schemas";
import { useCreateRole } from "@/features/roles/mutations/use-role-actions";
import { getErrorMessage } from "@/shared/errors/get-error-message";
import { PermissionPicker } from "@/features/roles/components/permission-picker";

export function CreateRoleDialog() {
  const [open, setOpen] = useState(false);
  const createRole = useCreateRole();

  const form = useForm<CreateRoleFormValues>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: { name: "", description: "", permissionIds: [] },
  });

  function onSubmit(values: CreateRoleFormValues) {
    createRole.mutate(values, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <Plus />
            New role
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create role</DialogTitle>
          <DialogDescription>
            Grant a bundle of permissions that can be assigned to users.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
            noValidate
          >
            {createRole.isError && (
              <Alert variant="destructive">
                <AlertDescription>
                  {getErrorMessage(createRole.error)}
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
                    <Input placeholder="Billing Manager" autoFocus {...field} />
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
                    <Input placeholder="Optional" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="permissionIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Permissions</FormLabel>
                  <PermissionPicker
                    selectedIds={field.value}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={createRole.isPending}>
                {createRole.isPending && <Spinner />}
                Create role
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}