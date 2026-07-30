import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Spinner } from "@/shared/components/ui/spinner";
import {
  Dialog,
  DialogContent,
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
  updatePermissionSchema,
  type UpdatePermissionFormValues,
} from "@/features/permissions/schemas/permission.schemas";
import { useUpdatePermission } from "@/features/permissions/mutations/use-permission-actions";
import type { Permission } from "@/features/permissions/types/permission.types";

export function EditPermissionDialog({ permission }: { permission: Permission }) {
  const [open, setOpen] = useState(false);
  const updatePermission = useUpdatePermission(permission.id);

  const form = useForm<UpdatePermissionFormValues>({
    resolver: zodResolver(updatePermissionSchema),
    defaultValues: { description: permission.description ?? "" },
  });

  function onSubmit(values: UpdatePermissionFormValues) {
    updatePermission.mutate(values, { onSuccess: () => setOpen(false) });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="Edit permission">
            <Pencil />
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit permission</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
            noValidate
          >
            <div className="rounded-lg border border-border bg-muted px-2.5 py-1.5 text-sm text-muted-foreground">
              {permission.key}
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input autoFocus {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={updatePermission.isPending}>
                {updatePermission.isPending && <Spinner />}
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}