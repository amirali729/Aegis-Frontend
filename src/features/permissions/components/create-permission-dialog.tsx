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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/forms/form";
import {
  createPermissionSchema,
  type CreatePermissionFormValues,
} from "@/features/permissions/schemas/permission.schemas";
import { useCreatePermission } from "@/features/permissions/mutations/use-permission-actions";
import { getErrorMessage } from "@/shared/errors/get-error-message";

export function CreatePermissionDialog() {
  const [open, setOpen] = useState(false);
  const createPermission = useCreatePermission();

  const form = useForm<CreatePermissionFormValues>({
    resolver: zodResolver(createPermissionSchema),
    defaultValues: { key: "", description: "" },
  });

  function onSubmit(values: CreatePermissionFormValues) {
    createPermission.mutate(values, {
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
            New permission
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create permission</DialogTitle>
          <DialogDescription>
            Permission keys are immutable once created — only the
            description can be edited later.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
            noValidate
          >
            {createPermission.isError && (
              <Alert variant="destructive">
                <AlertDescription>
                  {getErrorMessage(createPermission.error)}
                </AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key</FormLabel>
                  <FormControl>
                    <Input placeholder="invoice:view" autoFocus {...field} />
                  </FormControl>
                  <FormDescription>
                    Format: resource:action, lowercase only.
                  </FormDescription>
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

            <DialogFooter>
              <Button type="submit" disabled={createPermission.isPending}>
                {createPermission.isPending && <Spinner />}
                Create permission
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}