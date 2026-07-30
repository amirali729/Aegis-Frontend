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
  createApiKeySchema,
  type CreateApiKeyFormValues,
} from "@/features/applications/schemas/application.schemas";
import { useCreateApiKey } from "@/features/applications/mutations/use-api-keys";
import { getErrorMessage } from "@/shared/errors/get-error-message";
import { OneTimeSecretDialog } from "@/shared/components/one-time-secret-dialog";

export function CreateApiKeyDialog({ applicationId }: { applicationId: string }) {
  const [open, setOpen] = useState(false);
  const [reveal, setReveal] = useState<{ key: string; warning: string } | null>(
    null,
  );
  const createApiKey = useCreateApiKey(applicationId);

  const form = useForm<CreateApiKeyFormValues>({
    resolver: zodResolver(createApiKeySchema),
    defaultValues: { name: "" },
  });

  function onSubmit(values: CreateApiKeyFormValues) {
    createApiKey.mutate(values, {
      onSuccess: (data) => {
        setOpen(false);
        form.reset();
        setReveal({ key: data.key, warning: data.warning });
      },
    });
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          render={
            <Button variant="outline" size="sm">
              <Plus />
              New API key
            </Button>
          }
        />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create API key</DialogTitle>
            <DialogDescription>
              Used for server-to-server authentication as this application.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
              noValidate
            >
              {createApiKey.isError && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {getErrorMessage(createApiKey.error)}
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
                      <Input placeholder="Production server" autoFocus {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expiresInDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expires in (days)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Leave blank for no expiry"
                        value={field.value ?? ""}
                        onChange={(event) =>
                          field.onChange(
                            event.target.value === ""
                              ? undefined
                              : Number(event.target.value),
                          )
                        }
                      />
                    </FormControl>
                    <FormDescription>Between 1 and 3650 days.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit" disabled={createApiKey.isPending}>
                  {createApiKey.isPending && <Spinner />}
                  Create key
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {reveal && (
        <OneTimeSecretDialog
          open={Boolean(reveal)}
          onOpenChange={(isOpen) => !isOpen && setReveal(null)}
          title="API key created"
          label="API key"
          secret={reveal.key}
          warning={reveal.warning}
        />
      )}
    </>
  );
}